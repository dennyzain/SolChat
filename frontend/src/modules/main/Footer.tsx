import { StripeGuides } from '../../components/ui/backgrounds/stripes';
import Logo from '../../assets/logo-text-w.svg';


export default function Footer() {
    return (
        <div className="relative mt-7 w-screen h-[100px] bg-black-pearl overflow-visible">
            <StripeGuides
                columnCount={10}
                animated={true}
                animationDuration={8}
                animationDelay={0.5}
                glowColor="white"
                glowOpacity={1}
                randomize={true}
                randomInterval={4000}
                direction="both"
                easing="easeOut"
                darkMode={true}
                contained={true}
            />
            <div className="absolute w-[90%] mx-auto inset-0 flex items-center justify-center rounded-xl">
                <img src={Logo} alt="Logo" width={300} height={300} />
            </div>
        </div>
    )
}