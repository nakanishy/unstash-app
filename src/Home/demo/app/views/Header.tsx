import { headerHeight } from "../styles/variables";

export function Header() {
  return (
    <div
      className="flex items-center pl-[10px] pr-[10px] w-full"
      style={{ height: headerHeight }}
      data-tauri-drag-region={true}
    >
      {/*
      <div className="ml-3 w-[40px] h-[22px] perspective-[500]">
        <motion.div
          animate={{ rotateX: flipped ? 180 : 0 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="w-full h-full relative transform-3d"
        >
          <div className="absolute inset-0 flex items-center justify-center rounded bg-white-strong text-[10px] text-white backface-hidden">
            Search
          </div>

          <div className="absolute inset-0 flex items-center justify-center rounded bg-white-subtle text-[10px] text-white backface-hidden transform-[rotateX(180deg)]">
            Idle
          </div>
        </motion.div>
      </div>*/}
      {/*<div className="ml-auto">
        <motion.div
          className="flex items-center justify-center w-[34px] h-[26px] text-[#ffffff88] rounded-[9px] bg-white-surface cursor-pointer"
          whileTap={{
            scale: 0.95,
          }}
          whileHover={{
            scale: 1.03,
            color: "#fffffff0",
            backgroundColor: "#ffffff2f",
          }}
          onClickCapture={(e) => {
            e.stopPropagation();
          }}
        >
          ↓
        </motion.div>
      </div>*/}
    </div>
  );
}
