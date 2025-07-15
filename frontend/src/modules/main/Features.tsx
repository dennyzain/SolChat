
import { AuthStatus } from "../../components/authStatus";
import { motion } from "motion/react";
import { WalletButton } from "../../components/walletButton";
import { RotatingText } from "../../components/ui/text/rotating";

export default function Features() {
  return (
    <div className="w-screen pt-10 pb-5 bg-background">
      <div className="w-[87%] mx-auto flex flex-col gap-4 lg:w-[60%]">
        <h1 className="text-2xl font-geist text-black-pearl font-light leading-tight">
          Chatting with Us on Global Server
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-xl font-geist text-black-pearl font-light leading-tight">
            Your messages are
          </p>
          <RotatingText
            text={["Private", "Secure", "Anonymous"]}
            duration={2000}
            className="text-xl font-geist text-black-pearl font-medium leading-tight"
          />
        </div>
        <motion.div className="flex  flex-col justify-between gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 border border-neutral-200/50 group transition-all duration-300 hover:border-neutral-300 md:flex-row">
          <AuthStatus />
          <WalletButton />
        </motion.div>
      </div>
    </div>
  );
}
