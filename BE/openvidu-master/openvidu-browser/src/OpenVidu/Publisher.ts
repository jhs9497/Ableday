/*
 * (C) Copyright 2017-2020 OpenVidu (https://openvidu.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { OpenVidu } from './OpenVidu';
import { Session } from './Session';
import { Stream } from './Stream';
import { StreamManager } from './StreamManager';
import { EventDispatcher } from './EventDispatcher';
import { PublisherProperties } from '../OpenViduInternal/Interfaces/Public/PublisherProperties';
import { Event } from '../OpenViduInternal/Events/Event';
import { StreamEvent } from '../OpenViduInternal/Events/StreamEvent';
import { StreamPropertyChangedEvent } from '../OpenViduInternal/Events/StreamPropertyChangedEvent';
import { VideoElementEvent } from '../OpenViduInternal/Events/VideoElementEvent';
import { OpenViduError, OpenViduErrorName } from '../OpenViduInternal/Enums/OpenViduError';
import { VideoInsertMode } from '../OpenViduInternal/Enums/VideoInsertMode';
import { OpenViduLogger } from '../OpenViduInternal/Logger/OpenViduLogger';
import { PlatformUtils } from '../OpenViduInternal/Utils/Platform';

/**
 * @hidden
 */
const logger: OpenViduLogger = OpenViduLogger.getInstance();

/**
 * @hidden
 */
let platform: PlatformUtils;

/**
 * Packs local media streams. Participants can publish it to a session. Initialized with [[OpenVidu.initPublisher]] method
 *
 * ### Available event listeners (and events dispatched)
 *
 * - accessAllowed
 * - accessDenied
 * - accessDialogOpened
 * - accessDialogClosed
 * - streamCreated ([[StreamEvent]])
 * - streamDestroyed ([[StreamEvent]])
 * - _All events inherited from [[StreamManager]] class_
 */
export class Publisher extends StreamManager {

    /**
     * Whether the Publisher has been granted access to the requested input devices or not
     */
    accessAllowed = false;

    /**
     * Whether you have called [[Publisher.subscribeToRemote]] with value `true` or `false` (*false* by default)
     */
    isSubscribedToRemote = false;

    /**
     * The [[Session]] to which the Publisher belongs
     */
    session: Session; // Initialized by Session.publish(Publisher)

    private accessDenied = false;
    protected properties: PublisherProperties;
    private permissionDialogTimeout: NodeJS.Timer;

    /**
     * @hidden
     */
    openvidu: OpenVidu;
    /**
     * @hidden
     */
    videoReference: HTMLVideoElement;
    /**
     * @hidden
     */
    screenShareResizeInterval: NodeJS.Timer;

    /**
     * @hidden
     */
    constructor(targEl: string | HTMLElement, properties: PublisherProperties, openvidu: OpenVidu) {
        super(new Stream((!!openvidu.session) ? openvidu.session : new Session(openvidu), { publisherProperties: properties, mediaConstraints: {} }), targEl);
        platform = PlatformUtils.getInstance();
        this.properties = properties;
        this.openvidu = openvidu;

        this.stream.ee.on('local-stream-destroyed', (reason: string) => {
            this.stream.isLocalStreamPublished = false;
            const streamEvent = new StreamEvent(true, this, 'streamDestroyed', this.stream, reason);
            this.emitEvent('streamDestroyed', [streamEvent]);
            streamEvent.callDefaultBehavior();
        });
    }


    /**
     * Publish or unpublish the audio stream (if available). Calling this method twice in a row passing same value will have no effect
     *
     * #### Events dispatched
     *
     * > _Only if `Session.publish(Publisher)` has been called for this Publisher_
     *
     * The [[Session]] object of the local participant will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"audioActive"` and `reason` set to `"publishAudio"`
     * The [[Publisher]] object of the local participant will also dispatch the exact same event
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"audioActive"` and `reason` set to `"publishAudio"`
     * The respective [[Subscriber]] object of every other participant receiving this Publisher's stream will also dispatch the exact same event
     *
     * See [[StreamPropertyChangedEvent]] to learn more.
     *
     * @param value `true` to publish the audio stream, `false` to unpublish it
     */
    publishAudio(value: boolean): void {
        if (this.stream.audioActive !== value) {
            const affectedMediaStream: MediaStream = this.stream.displayMyRemote() ? this.stream.localMediaStreamWhenSubscribedToRemote! : this.stream.getMediaStream();
            affectedMediaStream.getAudioTracks().forEach((track) => {
                track.enabled = value;
            });
            if (!!this.session && !!this.stream.streamId) {
                this.session.openvidu.sendRequest(
                    'streamPropertyChanged',
                    {
                        streamId: this.stream.streamId,
                        property: 'audioActive',
                        newValue: value,
                        reason: 'publishAudio'
                    },
                    (error, response) => {
                        if (error) {
                            logger.error("Error sending 'streamPropertyChanged' event", error);
                        } else {
                            this.session.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent(this.session, this.stream, 'audioActive', value, !value, 'publishAudio')]);
                            this.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent(this, this.stream, 'audioActive', value, !value, 'publishAudio')]);
                            this.session.sendVideoData(this.stream.streamManager);
                        }
                    });
            }
            this.stream.audioActive = value;
            logger.info("'Publisher' has " + (value ? 'published' : 'unpublished') + ' its audio stream');
        }
    }


    /**
     * Publish or unpublish the video stream (if available). Calling this method twice in a row passing same value will have no effect
     *
     * #### Events dispatched
     *
     * > _Only if `Session.publish(Publisher)` has been called for this Publisher_
     *
     * The [[Session]] object of the local participant will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"videoActive"` and `reason` set to `"publishVideo"`
     * The [[Publisher]] object of the local participant will also dispatch the exact same event
     *
     * The [[Session]] object of every other participant connected to the session will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"videoActive"` and `reason` set to `"publishVideo"`
     * The respective [[Subscriber]] object of every other participant receiving this Publisher's stream will also dispatch the exact same event
     *
     * See [[StreamPropertyChangedEvent]] to learn more.
     *
     * @param value `true` to publish the video stream, `false` to unpublish it
     */
    publishVideo(value: boolean): void {
        if (this.stream.videoActive !== value) {
            const affectedMediaStream: MediaStream = this.stream.displayMyRemote() ? this.stream.localMediaStreamWhenSubscribedToRemote! : this.stream.getMediaStream();
            affectedMediaStream.getVideoTracks().forEach((track) => {
                track.enabled = value;
            });
            if (!!this.session && !!this.stream.streamId) {
                this.session.openvidu.sendRequest(
                    'streamPropertyChanged',
                    {
                        streamId: this.stream.streamId,
                        property: 'videoActive',
                        newValue: value,
                        reason: 'publishVideo'
                    },
                    (error, response) => {
                        if (error) {
                            logger.error("Error sending 'streamPropertyChanged' event", error);
                        } else {
                            this.session.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent(this.session, this.stream, 'videoActive', value, !value, 'publishVideo')]);
                            this.emitEvent('streamPropertyChanged', [new StreamPropertyChangedEvent(this, this.stream, 'videoActive', value, !value, 'publishVideo')]);
                            this.session.sendVideoData(this.stream.streamManager);
                        }
                    });
            }
            this.stream.videoActive = value;
            logger.info("'Publisher' has " + (value ? 'published' : 'unpublished') + ' its video stream');
        }
    }


    /**
     * Call this method before [[Session.publish]] if you prefer to subscribe to your Publisher's remote stream instead of using the local stream, as any other user would do.
     */
    subscribeToRemote(value?: boolean): void {
        value = (value !== undefined) ? value : true;
        this.isSubscribedToRemote = value;
        this.stream.subscribeToMyRemote(value);
    }


    /**
     * See [[EventDispatcher.on]]
     */
    on(type: string, handler: (event: Event) => void): EventDispatcher {
        super.on(type, handler);
        if (type === 'streamCreated') {
            if (!!this.stream && this.stream.isLocalStreamPublished) {
                this.emitEvent('streamCreated', [new StreamEvent(false, this, 'streamCreated', this.stream, '')]);
            } else {
                this.stream.ee.on('stream-created-by-publisher', () => {
                    this.emitEvent('streamCreated', [new StreamEvent(false, this, 'streamCreated', this.stream, '')]);
                });
            }
        }
        if (type === 'remoteVideoPlaying') {
            if (this.stream.displayMyRemote() && this.videos[0] && this.videos[0].video &&
                this.videos[0].video.currentTime > 0 &&
                this.videos[0].video.paused === false &&
                this.videos[0].video.ended === false &&
                this.videos[0].video.readyState === 4) {
                this.emitEvent('remoteVideoPlaying', [new VideoElementEvent(this.videos[0].video, this, 'remoteVideoPlaying')]);
            }
        }
        if (type === 'accessAllowed') {
            if (this.accessAllowed) {
                this.emitEvent('accessAllowed', []);
            }
        }
        if (type === 'accessDenied') {
            if (this.accessDenied) {
                this.emitEvent('accessDenied', []);
            }
        }
        return this;
    }


    /**
     * See [[EventDispatcher.once]]
     */
    once(type: string, handler: (event: Event) => void): Publisher {
        super.once(type, handler);
        if (type === 'streamCreated') {
            if (!!this.stream && this.stream.isLocalStreamPublished) {
                this.emitEvent('streamCreated', [new StreamEvent(false, this, 'streamCreated', this.stream, '')]);
            } else {
                this.stream.ee.once('stream-created-by-publisher', () => {
                    this.emitEvent('streamCreated', [new StreamEvent(false, this, 'streamCreated', this.stream, '')]);
                });
            }
        }
        if (type === 'remoteVideoPlaying') {
            if (this.stream.displayMyRemote() && this.videos[0] && this.videos[0].video &&
                this.videos[0].video.currentTime > 0 &&
                this.videos[0].video.paused === false &&
                this.videos[0].video.ended === false &&
                this.videos[0].video.readyState === 4) {
                this.emitEvent('remoteVideoPlaying', [new VideoElementEvent(this.videos[0].video, this, 'remoteVideoPlaying')]);
            }
        }
        if (type === 'accessAllowed') {
            if (this.accessAllowed) {
                this.emitEvent('accessAllowed', []);
            }
        }
        if (type === 'accessDenied') {
            if (this.accessDenied) {
                this.emitEvent('accessDenied', []);
            }
        }
        return this;
    }

    /**
     * Replaces the current video or audio track with a different one. This allows you to replace an ongoing track with a different one
     * without having to renegotiate the whole WebRTC connection (that is, initializing a new Publisher, unpublishing the previous one
     * and publishing the new one).
     *
     * You can get this new MediaStreamTrack by using the native Web API or simply with [[OpenVidu.getUserMedia]] method.
     *
     * **WARNING: this method has been proven to work in the majority of cases, but there may be some combinations of published/replaced tracks that may be incompatible
     * between them and break the connection in OpenVidu Server. A complete renegotiation may be the only solution in this case.
     * Visit [RTCRtpSender.replaceTrack](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack) documentation for further details.**
     *
     * @param track The [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) object to replace the current one.
     * If it is an audio track, the current audio track will be the replaced one. If it is a video track, the current video track will be the replaced one.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the track was successfully replaced and rejected with an Error object in other case
     */
    async replaceTrack(track: MediaStreamTrack): Promise<void> {

        const replaceTrackInMediaStream = (): Promise<void> => {
            return new Promise((resolve, reject) => {
                const mediaStream: MediaStream = this.stream.displayMyRemote() ? this.stream.localMediaStreamWhenSubscribedToRemote! : this.stream.getMediaStream();
                let removedTrack: MediaStreamTrack;
                if (track.kind === 'video') {
                    removedTrack = mediaStream.getVideoTracks()[0];
                } else {
                    removedTrack = mediaStream.getAudioTracks()[0];
                }
                mediaStream.removeTrack(removedTrack);
                removedTrack.stop();
                mediaStream.addTrack(track);
                if (track.kind === 'video' && this.stream.isLocalStreamPublished) {
                    this.openvidu.sendNewVideoDimensionsIfRequired(this, 'trackReplaced', 50, 30);
                    this.session.sendVideoData(this.stream.streamManager, 5, true, 5);
                }
                resolve();
            });
        }

        const replaceTrackInRtcRtpSender = (): Promise<void> => {
            return new Promise((resolve, reject) => {
                const senders: RTCRtpSender[] = this.stream.getRTCPeerConnection().getSenders();
                let sender: RTCRtpSender | undefined;
                if (track.kind === 'video') {
                    sender = senders.find(s => !!s.track && s.track.kind === 'video');
                    if (!sender) {
                        reject(new Error('There\'s no replaceable track for that kind of MediaStreamTrack in this Publisher object'));
                        return;
                    }
                } else if (track.kind === 'audio') {
                    sender = senders.find(s => !!s.track && s.track.kind === 'audio');
                    if (!sender) {
                        reject(new Error('There\'s no replaceable track for that kind of MediaStreamTrack in this Publisher object'));
                        return;
                    }
                } else {
                    reject(new Error('Unknown track kind ' + track.kind));
                    return;
                }
                (sender as RTCRtpSender).replaceTrack(track).then(() => {
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }

        // Set field "enabled" of the new track to the previous value
        const trackOriginalEnabledValue: boolean = track.enabled;
        if (track.kind === 'video') {
            track.enabled = this.stream.videoActive;
        } else if (track.kind === 'audio') {
            track.enabled = this.stream.audioActive;
        }
        try {
            if (this.stream.isLocalStreamPublished) {
                // Only if the Publisher has been published is necessary to call native Web API RTCRtpSender.replaceTrack
                // If it has not been published yet, replacing it on the MediaStream object is enough
                await replaceTrackInRtcRtpSender();
                return await replaceTrackInMediaStream();
            } else {
                // Publisher not published. Simply replace the track on the local MediaStream
                return await replaceTrackInMediaStream();
            }
        } catch (error) {
            track.enabled = trackOriginalEnabledValue;
            throw error;
        }
    }

    /* Hidden methods */

    /**
     * @hidden
     */
    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {

            let constraints: MediaStreamConstraints = {};
            let constraintsAux: MediaStreamConstraints = {};
            const timeForDialogEvent = 1500;
            let startTime;

            const errorCallback = (openViduError: OpenViduError) => {
                this.accessDenied = true;
                this.accessAllowed = false;
                logger.error(`Publisher initialization failed. ${openViduError.name}: ${openViduError.message}`)
                reject(openViduError);
            };

            const successCallback = (mediaStream: MediaStream) => {
                this.accessAllowed = true;
                this.accessDenied = false;

                if (typeof MediaStreamTrack !== 'undefined' && this.properties.audioSource instanceof MediaStreamTrack) {
                    mediaStream.removeTrack(mediaStream.getAudioTracks()[0]);
                    mediaStream.addTrack((<MediaStreamTrack>this.properties.audioSource));
                }

                if (typeof MediaStreamTrack !== 'undefined' && this.properties.videoSource instanceof MediaStreamTrack) {
                    mediaStream.removeTrack(mediaStream.getVideoTracks()[0]);
                    mediaStream.addTrack((<MediaStreamTrack>this.properties.videoSource));
                }

                // Apply PublisherProperties.publishAudio and PublisherProperties.publishVideo
                if (!!mediaStream.getAudioTracks()[0]) {
                    const enabled = (this.stream.audioActive !== undefined && this.stream.audioActive !== null) ? this.stream.audioActive : !!this.stream.outboundStreamOpts.publisherProperties.publishAudio;
                    mediaStream.getAudioTracks()[0].enabled = enabled;
                }
                if (!!mediaStream.getVideoTracks()[0]) {
                    const enabled = (this.stream.videoActive !== undefined && this.stream.videoActive !== null) ? this.stream.videoActive : !!this.stream.outboundStreamOpts.publisherProperties.publishVideo;
                    mediaStream.getVideoTracks()[0].enabled = enabled;
                }

                this.initializeVideoReference(mediaStream);

                if (!this.stream.displayMyRemote()) {
                    // When we are subscribed to our remote we don't still set the MediaStream object in the video elements to
                    // avoid early 'streamPlaying' event
                    this.stream.updateMediaStreamInVideos();
                }
                delete this.firstVideoElement;

                if (this.stream.isSendVideo()) {
                    // Has video track
                    this.getVideoDimensions(mediaStream).then(dimensions => {
                        this.stream.videoDimensions = {
                            width: dimensions.width,
                            height: dimensions.height
                        };

                        if (this.stream.isSendScreen()) {
                            // Set interval to listen for screen resize events
                            this.screenShareResizeInterval = setInterval(() => {
                                const settings: MediaTrackSettings = mediaStream.getVideoTracks()[0].getSettings();
                                const newWidth = settings.width;
                                const newHeight = settings.height;
                                if (this.stream.isLocalStreamPublished &&
                                    (newWidth !== this.stream.videoDimensions.width || newHeight !== this.stream.videoDimensions.height)) {
                                    this.openvidu.sendVideoDimensionsChangedEvent(
                                        this,
                                        'screenResized',
                                        this.stream.videoDimensions.width,
                                        this.stream.videoDimensions.height,
                                        newWidth || 0,
                                        newHeight || 0
                                    );
                                }
                            }, 650);
                        }

                        this.stream.isLocalStreamReadyToPublish = true;
                        this.stream.ee.emitEvent('stream-ready-to-publish', []);
                    });
                } else {
                    // Only audio track (no videoDimensions)
                    this.stream.isLocalStreamReadyToPublish = true;
                    this.stream.ee.emitEvent('stream-ready-to-publish', []);
                }
                resolve();
            };

            const getMediaSuccess = (mediaStream: MediaStream, definedAudioConstraint) => {
                this.clearPermissionDialogTimer(startTime, timeForDialogEvent);
                if (this.stream.isSendScreen() && this.stream.isSendAudio()) {
                    // When getting desktop as user media audio constraint must be false. Now we can ask for it if required
                    constraintsAux.audio = definedAudioConstraint;
                    constraintsAux.video = false;
                    startTime = Date.now();
                    this.setPermissionDialogTimer(timeForDialogEvent);

                    navigator.mediaDevices.getUserMedia(constraintsAux)
                        .then(audioOnlyStream => {
                            this.clearPermissionDialogTimer(startTime, timeForDialogEvent);
                            mediaStream.addTrack(audioOnlyStream.getAudioTracks()[0]);
                            successCallback(mediaStream);
                        })
                        .catch(error => {
                            this.clearPermissionDialogTimer(startTime, timeForDialogEvent);
                            mediaStream.getAudioTracks().forEach((track) => {
                                track.stop();
                            });
                            mediaStream.getVideoTracks().forEach((track) => {
                                track.stop();
                            });
                            errorCallback(this.openvidu.generateAudioDeviceError(error, constraints));
                            return;
                        });
                } else {
                    successCallback(mediaStream);
                }
            };

            const getMediaError = error => {
                logger.error(`getMediaError: ${error.toString()}`);
                this.clearPermissionDialogTimer(startTime, timeForDialogEvent);
                if (error.name === 'Error') {
                    // Safari OverConstrainedError has as name property 'Error' instead of 'OverConstrainedError'
                    error.name = error.constructor.name;
                }
                let errorName, errorMessage;
                switch (error.name.toLowerCase()) {
                    case 'notfounderror':
                        navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: constraints.video
                        })
                            .then(mediaStream => {
                                mediaStream.getVideoTracks().forEach((track) => {
                                    track.stop();
                                });
                                errorName = OpenViduErrorName.INPUT_AUDIO_DEVICE_NOT_FOUND;
                                errorMessage = error.toString();
                                errorCallback(new OpenViduError(errorName, errorMessage));
                            }).catch(e => {
                                errorName = OpenViduErrorName.INPUT_VIDEO_DEVICE_NOT_FOUND;
                                errorMessage = error.toString();
                                errorCallback(new OpenViduError(errorName, errorMessage));
                            });
                        break;
                    case 'notallowederror':
                        errorName = this.stream.isSendScreen() ? OpenViduErrorName.SCREEN_CAPTURE_DENIED : OpenViduErrorName.DEVICE_ACCESS_DENIED;
                        errorMessage = error.toString();
                        errorCallback(new OpenViduError(errorName, errorMessage));
                        break;
                    case 'overconstrainederror':
                        navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: constraints.video
                        })
                            .then(mediaStream => {
                                mediaStream.getVideoTracks().forEach((track) => {
                                    track.stop();
                                });
                                if (error.constraint.toLowerCase() === 'deviceid') {
                                    errorName = OpenViduErrorName.INPUT_AUDIO_DEVICE_NOT_FOUND;
                                    errorMessage = "Audio input device with deviceId '" + (<ConstrainDOMStringParameters>(<MediaTrackConstraints>constraints.audio).deviceId!!).exact + "' not found";
                                } else {
                                    errorName = OpenViduErrorName.PUBLISHER_PROPERTIES_ERROR;
                                    errorMessage = "Audio input device doesn't support the value passed for constraint '" + error.constraint + "'";
                                }
                                errorCallback(new OpenViduError(errorName, errorMessage));
                            }).catch(e => {
                                if (error.constraint.toLowerCase() === 'deviceid') {
                                    errorName = OpenViduErrorName.INPUT_VIDEO_DEVICE_NOT_FOUND;
                                    errorMessage = "Video input device with deviceId '" + (<ConstrainDOMStringParameters>(<MediaTrackConstraints>constraints.video).deviceId!!).exact + "' not found";
                                } else {
                                    errorName = OpenViduErrorName.PUBLISHER_PROPERTIES_ERROR;
                                    errorMessage = "Video input device doesn't support the value passed for constraint '" + error.constraint + "'";
                                }
                                errorCallback(new OpenViduError(errorName, errorMessage));
                            });
                        break;
                    case 'aborterror':
                    case 'notreadableerror':
                        errorName = OpenViduErrorName.DEVICE_ALREADY_IN_USE;
                        errorMessage = error.toString();
                        errorCallback(new OpenViduError(errorName, errorMessage));
                        break;
                    default:
                        errorName = OpenViduErrorName.GENERIC_ERROR;
                        errorMessage = error.toString();
                        errorCallback(new OpenViduError(errorName, errorMessage));
                        break;
                }
            }

            this.openvidu.generateMediaConstraints(this.properties)
                .then(myConstraints => {

                    if (!!myConstraints.videoTrack && !!myConstraints.audioTrack ||
                        !!myConstraints.audioTrack && myConstraints.constraints?.video === false ||
                        !!myConstraints.videoTrack && myConstraints.constraints?.audio === false) {
                        // No need to call getUserMedia at all. MediaStreamTracks already provided
                        successCallback(this.openvidu.addAlreadyProvidedTracks(myConstraints, new MediaStream()));
                        // Return as we do not need to process further
                        return;
                    }

                    constraints = myConstraints.constraints;

                    const outboundStreamOptions = {
                        mediaConstraints: constraints,
                        publisherProperties: this.properties
                    };
                    this.stream.setOutboundStreamOptions(outboundStreamOptions);

                    const definedAudioConstraint = ((constraints.audio === undefined) ? true : constraints.audio);
                    constraintsAux.audio = this.stream.isSendScreen() ? false : definedAudioConstraint;
                    constraintsAux.video = constraints.video;
                    startTime = Date.now();
                    this.setPermissionDialogTimer(timeForDialogEvent);

                    if (this.stream.isSendScreen() && navigator.mediaDevices['getDisplayMedia'] && !platform.isElectron()) {
                        navigator.mediaDevices['getDisplayMedia']({ video: true })
                            .then(mediaStream => {
                                this.openvidu.addAlreadyProvidedTracks(myConstraints, mediaStream);
                                getMediaSuccess(mediaStream, definedAudioConstraint);
                            })
                            .catch(error => {
                                getMediaError(error);
                            });
                    } else {
                        navigator.mediaDevices.getUserMedia(constraintsAux)
                            .then(mediaStream => {
                                this.openvidu.addAlreadyProvidedTracks(myConstraints, mediaStream);
                                getMediaSuccess(mediaStream, definedAudioConstraint);
                            })
                            .catch(error => {
                                getMediaError(error);
                            });
                    }

                })
                .catch((error: OpenViduError) => {
                    errorCallback(error);
                });
        });
    }

    /**
     * @hidden
     * 
     * To obtain the videoDimensions we wait for the video reference to have enough metadata
     * and then try to use MediaStreamTrack.getSettingsMethod(). If not available, then we
     * use the HTMLVideoElement properties videoWidth and videoHeight
     */
    getVideoDimensions(mediaStream: MediaStream): Promise<{ width: number, height: number }> {
        return new Promise((resolve, reject) => {

            // Ionic iOS and Safari iOS supposedly require the video element to actually exist inside the DOM
            const requiresDomInsertion: boolean = platform.isIonicIos() || platform.isIOSWithSafari();

            let loadedmetadataListener;
            const resolveDimensions = () => {
                let width: number;
                let height: number;
                if (typeof this.stream.getMediaStream().getVideoTracks()[0].getSettings === 'function') {
                    const settings = this.stream.getMediaStream().getVideoTracks()[0].getSettings();
                    width = settings.width || this.videoReference.videoWidth;
                    height = settings.height || this.videoReference.videoHeight;
                } else {
                    logger.warn('MediaStreamTrack does not have getSettings method on ' + platform.getDescription());
                    width = this.videoReference.videoWidth;
                    height = this.videoReference.videoHeight;
                }

                if (loadedmetadataListener != null) {
                    this.videoReference.removeEventListener('loadedmetadata', loadedmetadataListener);
                }
                if (requiresDomInsertion) {
                    document.body.removeChild(this.videoReference);
                }

                resolve({ width, height });
            }

            if (this.videoReference.readyState >= 1) {
                // The video already has metadata available
                // No need of loadedmetadata event
                resolveDimensions();
            } else {
                // The video does not have metadata available yet
                // Must listen to loadedmetadata event
                loadedmetadataListener = () => {
                    if (!this.videoReference.videoWidth) {
                        let interval = setInterval(() => {
                            if (!!this.videoReference.videoWidth) {
                                clearInterval(interval);
                                resolveDimensions();
                            }
                        }, 40);
                    } else {
                        resolveDimensions();
                    }
                };
                this.videoReference.addEventListener('loadedmetadata', loadedmetadataListener);
                if (requiresDomInsertion) {
                    document.body.appendChild(this.videoReference);
                }
            }
        });
    }

    /**
     * @hidden
     */
    reestablishStreamPlayingEvent() {
        if (this.ee.getListeners('streamPlaying').length > 0) {
            this.addPlayEventToFirstVideo();
        }
    }

    /**
     * @hidden
     */
    initializeVideoReference(mediaStream: MediaStream) {
        this.videoReference = document.createElement('video');
        this.videoReference.setAttribute('muted', 'true');
        this.videoReference.style.display = 'none';
        if (platform.isSafariBrowser() || (platform.isIPhoneOrIPad() && (platform.isChromeMobileBrowser() || platform.isEdgeMobileBrowser() || platform.isOperaMobileBrowser() || platform.isFirefoxMobileBrowser()))) {
            this.videoReference.setAttribute('playsinline', 'true');
        }
        this.stream.setMediaStream(mediaStream);
        if (!!this.firstVideoElement) {
            this.createVideoElement(this.firstVideoElement.targetElement, <VideoInsertMode>this.properties.insertMode);
        }
        this.videoReference.srcObject = mediaStream;
    }


    /* Private methods */

    private setPermissionDialogTimer(waitTime: number): void {
        this.permissionDialogTimeout = setTimeout(() => {
            this.emitEvent('accessDialogOpened', []);
        }, waitTime);
    }

    private clearPermissionDialogTimer(startTime: number, waitTime: number): void {
        clearTimeout(this.permissionDialogTimeout);
        if ((Date.now() - startTime) > waitTime) {
            // Permission dialog was shown and now is closed
            this.emitEvent('accessDialogClosed', []);
        }
    }

}
