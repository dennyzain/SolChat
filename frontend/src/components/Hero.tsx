import { HoleBackground } from "./Background";

export default function Hero() {
  return (
    <div className="h-[300px] w-screen relative">
      <HoleBackground />
      <div className="absolute top-0 left-0 h-full flex flex-col items-center justify-center">
        <div className="w-[85%] mx-auto">
          <h1 className="text-4xl font-geist text-black-pearl font-extrabold leading-tight">
            Chatting With Us on Global Server
          </h1>
          <p className="text-2xl font-geist text-grey-mamba font-normal leading-tight">
            Connect with the crypto community worldwide. Chatting with web3 has never been so
            simple.
          </p>
        </div>
      </div>
    </div>
  );
}
