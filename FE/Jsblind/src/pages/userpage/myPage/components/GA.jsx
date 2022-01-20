import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button
        style={{
          cursor: "pointer",
          color: "red",
          textShadow: "1px 1px 1px grey",
          fontSize: "14px",
          fontWeight: "bold",
          marginTop: "7px",
          border: "2px double violet",
          paddingLeft: "5px",
        }}
        onClick={handleOpen}
      >
        TIP💡
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ borderRadius: "10px" }}>
          <Typography
            style={{
              textAlign: "center",
              color: "red",
              textShadow: "1px 1px 1px grey",
            }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            TIP
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            style={{ textAlign: "center", color: "navy", fontSize: "0.85em" }}
          >
            다섯 글자, 다섯개의 키워드로 본인을 표현해 주세요!
            <br />
            매치를 원하시면 "메인으로"를 눌러주세요
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
