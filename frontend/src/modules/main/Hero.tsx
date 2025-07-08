import { ArrowRight, Wallet } from "lucide-react";
import { HoleBackground } from "../../components/ui/backgrounds/hole";
import { FlipButton } from "../../components/ui/buttons/flip";
import LogoTextOnly from "../../assets/logo-text.svg";

export default function Hero() {
  return (
    <div className="h-[500px] bg-[#eee] w-screen relative">
      <HoleBackground
        particleRGBColor={[0, 0, 0]}
        numberOfDiscs={100}
        numberOfLines={100}
        className="h-full w-full flex items-center justify-center"
      >
        <div className="w-[85%] z-10 mx-auto flex flex-col gap-4 lg:w-[60%]">
          <img src={LogoTextOnly} alt="Logo Text Only" className="w-[80%]" />
          <p className="text-xl font-geist text-grey-mamba font-normal leading-tight">
            Connect with the crypto community worldwide. Chatting with web3 has never been so
            simple.
          </p>
          <FlipButton
            frontText="Connect & Chat"
            backText="Lets Go!"
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Connect & Chat
            <ArrowRight className="w-5 h-5 ml-2" />
          </FlipButton>
        </div>
      </HoleBackground>
    </div >
  );
}
