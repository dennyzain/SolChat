import { StripeGuides } from '../../components/ui/backgrounds/stripes';
import Logo from '../../assets/logo-text-w.svg';
import { Github } from 'lucide-react';


export default function Footer() {
    return (
        <div className="relative mt-7 w-screen h-[70px] bg-black-pearl overflow-visible">
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
            <div className="absolute w-[90%] mx-auto inset-0 flex items-center justify-between rounded-xl lg:w-[55%]">
                <img src={Logo} alt="Logo" width={300} height={300} />
                <div className="flex items-center gap-2">
                    <a href="https://github.com/dennyzain/SolChat" target="_blank" rel="noopener noreferrer">
                        <Github className="w-6 h-6" color='white' />
                    </a>
                </div>
            </div>

        </div>
    )
}