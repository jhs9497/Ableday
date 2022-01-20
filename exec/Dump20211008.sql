-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: j5c105.p.ssafy.io    Database: blind_date_auth
-- ------------------------------------------------------
-- Server version	8.0.26-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user_auth`
--

DROP TABLE IF EXISTS `user_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_auth` (
  `id` varchar(13) COLLATE utf8_bin NOT NULL,
  `password` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `user_id` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_auth`
--

LOCK TABLES `user_auth` WRITE;
/*!40000 ALTER TABLE `user_auth` DISABLE KEYS */;
INSERT INTO `user_auth` VALUES ('U011j58263r21','$2a$10$yLioPl3SNuV9vvQriqOAZO7tfE.k/YfCoZCcBTbia52Ii2mU0N1Fm','ididid8'),('U0513s204y979','$2a$10$hFx3M5audXfA3z8PEdoEkeNzMsjFQ4fZS.LG/C1WxArl44ogLg/Ia','test123123'),('U0524s5406s83','$2a$10$FOKZo0ai2xBorBrYTs57veai1UPsOF5ZN4XWkwvjF390YaKsqcq8O','ididid6'),('U06649380g1h7','$2a$10$OseO46h1dZ7mM7LNV/d2Q.zwqV3xJfDyixb4peeBD7maEC3g2rgji','gustlr9484'),('U0d9427e43679','$2a$10$bqCr8OXLp09WEuYNIGLiVOhWPXx4oTi3PuUbwSuLe0yII7vF9RjuC','gustlr3131'),('U1774a2083g61','$2a$10$xuLm9qpuHnuueF/4VlEppeUAniRmT8fDSbnEDYFs8hPwPmVDiMDXW','ididid9'),('U1dk312551435','$2a$10$YZmyTugSVqR8.Iozib/AUuq70MbQnhEhK1Ys7MZ8MkpcXWv67m86m','ididid7'),('U2vz780865368','$2a$10$s3aRzoN7VZkP.U0j/8BmJuXXG/vMW0J2e7W.KjDU1c1lVm5shxug6','gustlr'),('U3193q73w9757','$2a$10$eJXJBDlqUtRHqsEUaqM00u8YvXXQHiXWVW2TbuRlvTLhAFUBWHgsq','ididid4'),('U3721r06098g5','$2a$10$T5c2gBfbM9v3U/KNYw1p/.3iBIwLAn8vtT5T9fovB.Mf9LG68Zmli','ididid12'),('U3d00f3565100','$2a$10$uWtOWgqCng9BEDZTBWd2b.koS44ebExltTgCewGXk.o8ZpkpEGfxi','zxc1234'),('U42s581042x81','$2a$10$q1i25shOxZ6unNCBVSjlIuR40yis758V.uVBWhOFPffdN83kNjkue','ssafy'),('U50548b8a6379','$2a$10$f.5MlHX36Zsh5qMQMvROYeFJ2wtxse7a3otsHDaIxlXMACngeOQ8m','ididid1'),('U5u3100651q56','$2a$10$KWQFcbaBJqDBP5hJhSFIR.q34ahecLDYYBJl9.dLg9wYLARJpGdSC','test'),('U69a1337622c8','$2a$10$7L3l3b6TOcj/CW8uwzbZbuxWHkJUiIkbMazd1aB2L/MyEs/ZOGliy','ididid5'),('U6r4405802v87','$2a$10$F7ZsljkOk8g3UYEJPR9dHONG5igeNe8VnIm1bNmKak0OkisGptgsm','xxxxxx'),('U6x4392390w93','$2a$10$f2i2YQS0Acc06bl9mlS/4ukHztd/KQ/Nw31SlBtj.HOCq7qzMxreS','teapot1'),('U71464335ay29','$2a$10$8Yy6SUc6qDf2TtoVJK7esOuHodUbmTG8sHFy832Ss2GjFwjYNO9Fm','ididid2'),('U71927l64o915','$2a$10$bjf8M5Ly9Q2hnrp/3qehj.raTm8rNRm6T5xVm/ZLHmW9eWva4ly/m','dkssudgkt'),('U7641i725m862','$2a$10$CmBVVXAHLYXtSIEvvlMRI.focB.g48S0ZgC7V8x6.1q0yNYGpALD6','test12345'),('U7b16863x7085','$2a$10$IdkOa442lrUQsM0yBf616.tODOe7vDWIMuO8RnN3NfMMTltUPXsR2','teapot'),('U8k435i203803','$2a$10$P97c9orvmlzR7dXn/5sl8uMFzbzQcuMGO.Bad/LfTRGZpP/yKtYVO','test2'),('U9032k65o8591','$2a$10$TVk2vuls3Bv0FmtGu1IcFebc2xWb3VmconRC7mEROfQidUY85gW3C','ididid3'),('Ug14346i87905','$2a$10$e5LBCMaL04lBPY.Yk2eV/eX8KkJ7U24djQFQv6Q0pz7m5mwO26bUG','jhs9497'),('Uo5597p255286','$2a$10$rrLiZ7aGDGSgjzYnoAx9lOPbWTr26AfcaM.y5g0VqhnLceWGd9QHW','gustlr5043'),('Up0686021k394','$2a$10$gYOFlNN919hvDqIYrUFe7eCX50rxoBMMKiUsAJlkqKddx2nvXEdOW','testtest'),('Us48556t99679','$2a$10$O7p8p2OkQKN0RCI.WuonQ.8PoQglDZfbfuIk8ZAtMVcyjCQ/02Ye2','ididid10'),('Ux627791985c8','$2a$10$8VBX4pQo.59zmMG7aliiw.JAZa1EV9bfFRXDU9GhUxBHnRU0flz8u','test123');
/*!40000 ALTER TABLE `user_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_friend`
--

DROP TABLE IF EXISTS `user_friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_friend` (
  `id` varchar(13) COLLATE utf8_bin NOT NULL,
  `user_id1` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `user_id2` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_friend`
--

LOCK TABLES `user_friend` WRITE;
/*!40000 ALTER TABLE `user_friend` DISABLE KEYS */;
INSERT INTO `user_friend` VALUES ('F23423423342D','ididid4','ididid1'),('F23423423342f','ididid1','ididid4'),('F23423423342s','ididid3','ididid1'),('F23433fdd342s','ididid1','ididid3'),('F611231388394','ididid1','ididid6'),('F613cq0388394','ididid6','ididid1'),('F613cq0dfe394','ididid1','ididid7'),('F613cqfef83d4','ididid7','ididid1');
/*!40000 ALTER TABLE `user_friend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profile` (
  `id` varchar(13) COLLATE utf8_bin NOT NULL,
  `animal` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `animal_accuracy` float DEFAULT NULL,
  `ban` bit(1) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `humorous` float DEFAULT NULL,
  `introduction_keyword1` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `introduction_keyword2` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `introduction_keyword3` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `introduction_keyword4` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `introduction_keyword5` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `likeability` float DEFAULT NULL,
  `manner` float DEFAULT NULL,
  `nickname` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `review_count` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profile`
--

LOCK TABLES `user_profile` WRITE;
/*!40000 ALTER TABLE `user_profile` DISABLE KEYS */;
INSERT INTO `user_profile` VALUES ('U011j58263r21','cat',0,_binary '\0','1212-12-12','female',0,NULL,NULL,NULL,NULL,NULL,0,0,'88888888',0),('U0513s204y979','horse',0,_binary '\0','1993-09-13','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'ㅁㄴㅇㅁㅈㅇ',0),('U0524s5406s83','cat',0,_binary '\0','1212-12-12','female',0,'꼬북','꼬북칩','브걸','','',0,0,'꼬부기',0),('U06649380g1h7','cat',0,_binary '\0','1994-11-21','female',0,NULL,NULL,NULL,NULL,NULL,0,0,'현식현식스',0),('U0d9427e43679','cat',5,_binary '\0','1994-11-21','female',5,NULL,NULL,NULL,NULL,NULL,5,4.5,'ghdnghdndd',2),('U1774a2083g61','horse',0,_binary '\0','1212-12-12','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'nnnn9',0),('U1dk312551435','dinosaur',0,_binary '\0','1111-11-11','male',0,'존예','소시','존예','존예','',0,0,'윤아존예',0),('U2vz780865368','horse',0,_binary '\0','1992-01-01','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'하리하하이ss',0),('U3193q73w9757','cat',0,_binary '\0','1212-12-12','female',0,'손얘','존예','이쁘다','어머','정말',0,0,'손예진짱',0),('U3721r06098g5','cat',0,_binary '\0','1212-12-12','female',0,NULL,NULL,NULL,NULL,NULL,0,0,'nnnn12',0),('U3d00f3565100',NULL,0,_binary '\0','1996-01-01','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'김싸피싸피',0),('U42s581042x81',NULL,0,_binary '\0','1994-11-10','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'안녕하세요',0),('U50548b8a6379','rabbit',4,_binary '\0','1111-11-11','male',4,'소개팅','미팅','데이트','화이팅','커플',4,4,'애블데이',9),('U5u3100651q56','animal1',4.50633,_binary '\0','2021-10-01','male',4.55696,NULL,NULL,NULL,NULL,NULL,4.46835,4.18987,'ThisIsNickname',79),('U69a1337622c8',NULL,0,_binary '\0','1111-11-11','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'nnnn5',0),('U6r4405802v87',NULL,0,_binary '\0','1993-01-12','female',0,NULL,NULL,NULL,NULL,NULL,0,0,'오로지싸피',0),('U6x4392390w93','horse',0,_binary '\0','1980-01-21','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'부글부글1',0),('U71464335ay29','cat',4.55556,_binary '\0','1212-12-12','female',4.44444,'덕배','츄르','코숏','고냥이','집사',4,3.77778,'김냥이',9),('U71927l64o915','cat',5,_binary '\0','1994-11-21','female',5,NULL,NULL,NULL,NULL,NULL,4.5,4,'ghdnghdnd',2),('U7641i725m862',NULL,0,_binary '\0','1545-04-28','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'이순신짱짱',0),('U7b16863x7085','dog',0,_binary '\0','1992-01-21','male',0,'돼지고기','소고기','닭고기','좋아해요','',0,0,'부글부글2',0),('U8k435i203803','animal1',0,_binary '\0','2021-10-01','female',0,NULL,NULL,NULL,NULL,NULL,0,0,'ThisIsNickname',0),('U9032k65o8591','wolf',0,_binary '\0','1111-11-11','male',0,'엑소','낭군','디오','연기자','가수',0,0,'공룡디오',0),('Ug14346i87905','horse',5,_binary '\0','1994-11-21','male',5,'배고프다아','아닐꺼어얼','하아아이이','후우우우우','아아아아아',4,4,'조현식조현식',2),('Uo5597p255286','bear',5,_binary '\0','1994-11-21','male',5,NULL,NULL,NULL,NULL,NULL,5,3,'현식조우킹d',2),('Up0686021k394','rabbit',0,_binary '\0','1993-09-13','male',0,NULL,NULL,NULL,NULL,NULL,0,0,'testset',0),('Us48556t99679','cat',0,_binary '\0','1212-12-12','female',0,NULL,NULL,NULL,NULL,NULL,0,0,'nnnn10',0),('Ux627791985c8','dinosaur',0,_binary '\0','1000-09-09','male',0.123,'가나다라바','가나다라바','가나다라바','가나다라바','가나다라바',2.34,3.45,'가나다라바',22);
/*!40000 ALTER TABLE `user_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_review`
--

DROP TABLE IF EXISTS `user_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_review` (
  `id` varchar(13) COLLATE utf8_bin NOT NULL,
  `animal_accuracy` int NOT NULL,
  `humorous` int NOT NULL,
  `likeability` int NOT NULL,
  `manner` int NOT NULL,
  `reviewer` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `user_id` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_review`
--

LOCK TABLES `user_review` WRITE;
/*!40000 ALTER TABLE `user_review` DISABLE KEYS */;
INSERT INTO `user_review` VALUES ('R0373k3t37927',5,5,5,5,'gustlr5043','test'),('R0444ra939920',4,5,5,3,'jhs9497','test'),('R049u86j88690',5,4,4,5,'jhs9497','test'),('R0849o6z32608',5,5,5,4,'gustlr5043','test'),('R095295d397q5',5,5,5,5,'dkssudgkt','jhs9497'),('R0h87595a0564',5,5,3,5,'jhs9497','test'),('R0j1f66803611',5,4,5,5,'gustlr5043','test'),('R0r1149r99744',5,5,4,4,'gustlr','test'),('R125dv7462737',4,4,4,4,'ididid2','ididid1'),('R13507018l6c0',3,4,4,4,'ididid2','ididid1'),('R16362755a4f1',5,5,5,4,'gustlr','test'),('R165m262b5789',5,5,5,5,'test','test'),('R1706644va660',5,5,4,5,'gustlr','test'),('R171938r24z73',3,3,3,3,'ididid1','test'),('R1925w0r72507',5,5,5,4,'gustlr5043','test'),('R1g27393672f3',4,4,4,4,'gustlr5043','test'),('R1o59x9570402',5,5,5,5,'gustlr5043','gustlr3131'),('R1s63956k3938',4,3,5,5,'jhs9497','test'),('R1xk259867894',5,4,5,5,'jhs9497','test'),('R2041o098d455',4,5,5,5,'jhs9497','test'),('R20d641f58723',5,5,4,3,'jhs9497','test'),('R2140r9070v11',5,5,4,3,'jhs9497','test'),('R23033103bw64',5,5,1,1,'ididid1','ididid2'),('R233o270p3845',4,4,4,4,'ididid2','ididid1'),('R234p7u313868',5,4,4,4,'ididid2','ididid1'),('R254682am0757',4,5,4,4,'jhs9497','test'),('R276gm2226154',4,5,5,5,'gustlr5043','test'),('R27n363020x22',5,5,5,5,'jhs9497','test'),('R29073o1l8643',4,5,4,4,'jhs9497','test'),('R29744u365v40',4,4,4,4,'ididid2','ididid1'),('R2k4234530u47',5,5,4,3,'gustlr5043','test'),('R31761c3r0993',5,5,5,5,'ssafy','test'),('R33171g0e0488',5,5,4,3,'gustlr5043','test'),('R335j2718v720',5,5,4,4,'jhs9497','test'),('R3788325x4d33',4,4,4,4,'gustlr5043','test'),('R37i2450w7047',5,5,4,4,'jhs9497','test'),('R38h0753104v2',3,3,3,4,'ididid2','ididid1'),('R3n72974551h9',5,4,5,4,'jhs9497','test'),('R42w1634q0750',5,5,5,3,'jhs9497','test'),('R486k79386z00',5,5,5,4,'jhs9497','test'),('R486s118774j8',5,5,5,4,'jhs9497','test'),('R4eo442313327',4,5,4,4,'jhs9497','test'),('R4o83278a9590',4,5,5,5,'gustlr9484','test'),('R4r290v654198',4,4,5,5,'gustlr','test'),('R4s99k8875463',5,5,4,4,'gustlr5043','test'),('R51936994z0c2',5,5,5,5,'ididid1','test'),('R52665a103o47',5,5,5,4,'gustlr5043','test'),('R52916f840s76',5,4,5,4,'gustlr9484','test'),('R54k4h9270438',5,4,5,5,'jhs9497','test'),('R55084z688i80',4,4,5,5,'gustlr9484','test'),('R572502831bf9',5,5,4,4,'gustlr','test'),('R59477q2n7868',4,5,4,3,'gustlr5043','test'),('R5c8917687e78',4,4,4,4,'jhs9497','test'),('R600r375g1804',4,4,4,4,'ididid1','ididid2'),('R60601450rw18',3,5,3,4,'gustlr5043','test'),('R64194r6a8978',5,5,4,5,'gustlr5043','test'),('R68440353tz13',5,5,5,5,'ssafy','test'),('R6h85l4903700',3,4,5,2,'jhs9497','test'),('R6y642448z334',5,5,4,3,'jhs9497','dkssudgkt'),('R711t52s06869',4,4,4,5,'gustlr5043','test'),('R7301227xt578',5,4,4,4,'ididid1','ididid2'),('R753599k9u819',5,5,5,4,'ididid1','ididid2'),('R759v60359e09',4,4,4,5,'jhs9497','test'),('R7657j0x31448',4,5,4,4,'ididid2','ididid1'),('R786bm9833157',4,5,5,5,'gustlr9484','test'),('R78y85605j544',4,4,4,4,'jhs9497','test'),('R8012c53442q4',4,4,5,5,'jhs9497','test'),('R820e93536a52',5,4,4,5,'gustlr','test'),('R8472yx301727',4,4,5,4,'gustlr','test'),('R855d1t995569',4,4,5,4,'jhs9497','test'),('R8712889p3r36',5,5,5,4,'gustlr5043','gustlr3131'),('R88w399f33177',5,5,5,5,'ididid1','ididid2'),('R89960s684o29',4,4,4,4,'gustlr5043','test'),('R8n3f72346705',5,4,4,5,'jhs9497','test'),('R900y2747p421',5,5,5,5,'test','test'),('R9064k70o5058',5,4,5,5,'gustlr','test'),('R9146l782j424',4,5,4,4,'jhs9497','test'),('R933j2k665547',4,5,4,3,'gustlr5043','test'),('R942708o85t59',5,4,4,5,'ididid1','ididid2'),('R9690z5204a87',5,5,5,4,'jhs9497','test'),('Rb35878817l09',4,5,4,4,'jhs9497','test'),('Rc84611l27375',4,4,4,4,'ididid1','ididid2'),('Rc8l538267975',4,4,4,2,'jhs9497','test'),('Re0o241047938',4,4,5,5,'jhs9497','test'),('Re99866k23666',4,4,5,5,'gustlr','test'),('Rf59439t86168',4,4,4,3,'ididid1','test'),('Rg827c9830338',5,5,5,3,'gustlr3131','gustlr5043'),('Ri64737l93964',4,4,4,4,'ididid1','test'),('Rk42t76676241',5,5,5,5,'jhs9497','dkssudgkt'),('Rk6059696j950',5,4,4,5,'jhs9497','test'),('Rm1904g601013',4,5,4,3,'gustlr5043','test'),('Rm81694z18417',5,4,5,4,'gustlr5043','test'),('Rn8m870984890',5,4,5,4,'jhs9497','test'),('Ro477942l7214',4,4,4,3,'ididid1','ididid2'),('Rp9236s392454',5,4,5,4,'ididid2','ididid1'),('Rq769848g7396',5,5,5,3,'gustlr3131','gustlr5043'),('Rs16w03655953',4,5,4,4,'jhs9497','test'),('Rt5006572c474',4,4,5,5,'jhs9497','test'),('Rv5523851t402',5,5,4,4,'gustlr5043','test'),('Rw365894593w2',4,5,5,4,'ididid1','ididid2'),('Rw5r616889791',5,5,5,3,'jhs9497','test'),('Rx338u7401376',5,5,4,5,'jhs9497','test'),('Rx95144s46809',5,5,5,3,'gustlr','test'),('Rz62487x10691',5,5,3,3,'dkssudgkt','jhs9497'),('Rz78797w96893',4,4,4,4,'ididid2','ididid1');
/*!40000 ALTER TABLE `user_review` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-08  3:18:04
