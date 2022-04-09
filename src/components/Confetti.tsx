import ReactCanvasConfetti from "react-canvas-confetti";

const Confetti = (props: any) => {
  return (
    <ReactCanvasConfetti
      refConfetti={props.confetti.getInstance}
      style={{
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        position: "fixed",
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
};

export default Confetti;
