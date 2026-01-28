import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { dbService } from '@/services/api';
import { LayoutWrapper } from '@/components/ui/LayoutWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { ModernInput } from '@/components/ui/ModernInput';
import { ModernButton } from '@/components/ui/ModernButton';
import { LogIn } from 'lucide-react';

// Helper function to get position relative to the document
const getPosition = (el: HTMLElement) => {
    let xPos = 0;
    let yPos = 0;

    let currentEl: HTMLElement | null = el;
    while (currentEl) {
        if (currentEl.tagName === "BODY") {
            const xScroll = currentEl.scrollLeft || document.documentElement.scrollLeft;
            const yScroll = currentEl.scrollTop || document.documentElement.scrollTop;
            xPos += (currentEl.offsetLeft - xScroll + currentEl.clientLeft);
            yPos += (currentEl.offsetTop - yScroll + currentEl.clientTop);
        } else {
            xPos += (currentEl.offsetLeft - currentEl.scrollLeft + currentEl.clientLeft);
            yPos += (currentEl.offsetTop - currentEl.scrollTop + currentEl.clientTop);
        }
        // @ts-ignore
        currentEl = currentEl.offsetParent;
    }
    return { x: xPos, y: yPos };
};

// Helper to get angle
const getAngle = (x1: number, y1: number, x2: number, y2: number) => {
    const angle = Math.atan2(y1 - y2, x1 - x2);
    return angle;
};

interface LoginYetiProps {
    onLogin: (usuario: any) => void;
}

export function LoginYeti({ onLogin }: LoginYetiProps) {
    const [email, setEmail] = useState('admin@sorvete.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Refs for logic
    const emailRef = useRef<HTMLInputElement>(null);
    const svgRef = useRef<HTMLDivElement>(null); // .svgContainer
    const containerRef = useRef<HTMLDivElement>(null); // For scoped selection

    useEffect(() => {
        // Initial setup
        if (!containerRef.current) return;
        const q = gsap.utils.selector(containerRef);
        const armL = q('.armL');
        const armR = q('.armR');

        gsap.set(armL, { x: -93, y: 220, rotation: 105, transformOrigin: "top left" });
        gsap.set(armR, { x: -93, y: 220, rotation: -105, transformOrigin: "top right" });

    }, []);

    const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        updateFace(e.target.value.length, e.target.value);
    };

    const handleEmailFocus = () => {
        updateFace(email.length, email);
    };

    const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        resetFace();
    };

    const handlePasswordFocus = () => {
        coverEyes();
    };

    const handlePasswordBlur = () => {
        uncoverEyes();
    };

    const coverEyes = () => {
        if (!containerRef.current) return;
        const q = gsap.utils.selector(containerRef);
        const armL = q('.armL');
        const armR = q('.armR');
        gsap.to(armL, { duration: 0.45, x: -93, y: 2, rotation: 0, ease: "quad.out" });
        gsap.to(armR, { duration: 0.45, x: -93, y: 2, rotation: 0, ease: "quad.out", delay: 0.1 });
    };

    const uncoverEyes = () => {
        if (!containerRef.current) return;
        const q = gsap.utils.selector(containerRef);
        const armL = q('.armL');
        const armR = q('.armR');
        gsap.to(armL, { duration: 1.35, y: 220, ease: "quad.out" });
        gsap.to(armL, { duration: 1.35, rotation: 105, ease: "quad.out", delay: 0.1 });
        gsap.to(armR, { duration: 1.35, y: 220, ease: "quad.out" });
        gsap.to(armR, { duration: 1.35, rotation: -105, ease: "quad.out", delay: 0.1 });
    };

    const resetFace = () => {
        if (!containerRef.current) return;
        const q = gsap.utils.selector(containerRef);
        gsap.to(q(['.eyeL', '.eyeR']), { duration: 1, x: 0, y: 0, ease: "expo.out" });
        gsap.to(q('.nose'), { duration: 1, x: 0, y: 0, scaleX: 1, scaleY: 1, ease: "expo.out" });
        gsap.to(q('.mouth'), { duration: 1, x: 0, y: 0, rotation: 0, ease: "expo.out" });
        gsap.to(q('.chin'), { duration: 1, x: 0, y: 0, scaleY: 1, ease: "expo.out" });
        gsap.to(q(['.face', '.eyebrow']), { duration: 1, x: 0, y: 0, skewX: 0, ease: "expo.out" });
        gsap.to(q(['.earL .outerEar', '.earR .outerEar', '.earL .earHair', '.earR .earHair', '.hair']), { duration: 1, x: 0, y: 0, scaleY: 1, ease: "expo.out" });
    };

    const updateFace = (curEmailIndex: number, value: string) => {
        if (!emailRef.current || !svgRef.current || !containerRef.current) return;

        // Calculate Caret Position
        const carPos = emailRef.current.selectionEnd || 0;
        const div = document.createElement('div');
        const span = document.createElement('span');
        const copyStyle = getComputedStyle(emailRef.current);

        Array.from(copyStyle).forEach((prop) => {
            // @ts-ignore
            div.style[prop] = copyStyle[prop];
        });

        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        div.textContent = value.substr(0, carPos);
        span.textContent = value.substr(carPos) || '.';
        div.appendChild(span);

        const emailCoords = getPosition(emailRef.current);
        const caretCoords = getPosition(span);
        const svgCoords = getPosition(svgRef.current);
        const screenCenter = svgCoords.x + (svgRef.current.offsetWidth / 2);
        const caretPos = caretCoords.x + emailCoords.x;

        const dFromC = screenCenter - caretPos;
        let pFromC = Math.round((caretPos / screenCenter) * 100) / 100;
        if (pFromC < 1) { } else if (pFromC > 1) {
            pFromC -= 2;
            pFromC = Math.abs(pFromC);
        }

        const eyeMaxHorizD = 20;
        // const eyeMaxVertD = 10;
        const noseMaxHorizD = 23;
        const noseMaxVertD = 10;

        const eyeMaxVertD = 10; // Defined this locally inside updateFace as previously

        let eyeDistH = -dFromC * .05;
        if (eyeDistH > eyeMaxHorizD) {
            eyeDistH = eyeMaxHorizD;
        } else if (eyeDistH < -eyeMaxHorizD) {
            eyeDistH = -eyeMaxHorizD;
        }

        const eyeLCoords = { x: svgCoords.x + 84, y: svgCoords.y + 76 };
        const eyeRCoords = { x: svgCoords.x + 113, y: svgCoords.y + 76 };
        const noseCoords = { x: svgCoords.x + 97, y: svgCoords.y + 81 };
        const mouthCoords = { x: svgCoords.x + 100, y: svgCoords.y + 100 };

        const eyeLAngle = getAngle(eyeLCoords.x, eyeLCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
        const eyeLX = Math.cos(eyeLAngle) * eyeMaxHorizD;
        const eyeLY = Math.sin(eyeLAngle) * eyeMaxVertD;

        const eyeRAngle = getAngle(eyeRCoords.x, eyeRCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
        const eyeRX = Math.cos(eyeRAngle) * eyeMaxHorizD;
        const eyeRY = Math.sin(eyeRAngle) * eyeMaxVertD;

        const noseAngle = getAngle(noseCoords.x, noseCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
        const noseX = Math.cos(noseAngle) * noseMaxHorizD;
        const noseY = Math.sin(noseAngle) * noseMaxVertD;

        const mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
        const mouthX = Math.cos(mouthAngle) * noseMaxHorizD;
        const mouthY = Math.sin(mouthAngle) * noseMaxVertD;
        const mouthR = Math.cos(mouthAngle) * 6;

        const chinX = mouthX * .8;
        const chinY = mouthY * .5;
        let chinS = 1 - ((dFromC * .15) / 100);
        if (chinS > 1) { chinS = 1 - (chinS - 1); }

        const faceX = mouthX * .3;
        const faceY = mouthY * .4;
        const faceSkew = Math.cos(mouthAngle) * 5;
        const eyebrowSkew = Math.cos(mouthAngle) * 25;
        const outerEarX = Math.cos(mouthAngle) * 4;
        const outerEarY = Math.cos(mouthAngle) * 5;
        const hairX = Math.cos(mouthAngle) * 6;
        const hairS = 1.2;

        const q = gsap.utils.selector(containerRef);

        gsap.to(q('.eyeL'), { duration: 1, x: -eyeLX, y: -eyeLY, ease: "expo.out" });
        gsap.to(q('.eyeR'), { duration: 1, x: -eyeRX, y: -eyeRY, ease: "expo.out" });
        gsap.to(q('.nose'), { duration: 1, x: -noseX, y: -noseY, rotation: mouthR, transformOrigin: "center center", ease: "expo.out" });
        gsap.to(q('.mouth'), { duration: 1, x: -mouthX, y: -mouthY, rotation: mouthR, transformOrigin: "center center", ease: "expo.out" });
        gsap.to(q('.chin'), { duration: 1, x: -chinX, y: -chinY, scaleY: chinS, ease: "expo.out" });
        gsap.to(q('.face'), { duration: 1, x: -faceX, y: -faceY, skewX: -faceSkew, transformOrigin: "center top", ease: "expo.out" });
        gsap.to(q('.eyebrow'), { duration: 1, x: -faceX, y: -faceY, skewX: -eyebrowSkew, transformOrigin: "center top", ease: "expo.out" });
        gsap.to(q('.earL .outerEar'), { duration: 1, x: outerEarX, y: -outerEarY, ease: "expo.out" });
        gsap.to(q('.earR .outerEar'), { duration: 1, x: outerEarX, y: outerEarY, ease: "expo.out" });
        gsap.to(q('.earL .earHair'), { duration: 1, x: -outerEarX, y: -outerEarY, ease: "expo.out" });
        gsap.to(q('.earR .earHair'), { duration: 1, x: -outerEarX, y: outerEarY, ease: "expo.out" });
        gsap.to(q('.hair'), { duration: 1, x: hairX, scaleY: hairS, transformOrigin: "center bottom", ease: "expo.out" });

        document.body.removeChild(div);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const usuario = await dbService.authService.login(email, password);
            onLogin(usuario);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro ao realizar login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutWrapper>
            <div className="flex items-center justify-center min-h-full py-12" ref={containerRef}>
                <GlassCard className="w-full max-w-md relative flex flex-col items-center">

                    {/* SVG Container adapted */}
                    <div ref={svgRef} className="w-[180px] h-[180px] bg-slate-100 rounded-full border-4 border-slate-300 overflow-hidden relative mb-8 -mt-20 shadow-2xl">
                        <div className="w-full h-full relative">
                            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200">
                                <defs>
                                    <circle id="armMaskPath" cx="100" cy="100" r="100" />
                                </defs>
                                <clipPath id="armMask">
                                    <use xlinkHref="#armMaskPath" overflow="visible" />
                                </clipPath>
                                <circle cx="100" cy="100" r="100" fill="#a9ddf3" />
                                <g className="body">
                                    <path fill="#FFFFFF" d="M193.3,135.9c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1 c-10.6,0-20,5.1-25.8,13l0,78h187L193.3,135.9z" />
                                    <path fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M193.3,135.9 c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1c-10.6,0-20,5.1-25.8,13" />
                                    <path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z" />
                                </g>
                                <g className="earL">
                                    <g className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                                        <circle cx="47" cy="83" r="11.5" />
                                        <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <g className="earHair">
                                        <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
                                        <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </g>
                                <g className="earR">
                                    <g className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
                                        <circle cx="155" cy="83" r="11.5" />
                                        <path d="M155.7 78.9c2.3 0 4.1 1.9 4.1 4.1 0 2.3-1.9 4.1-4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <g className="earHair">
                                        <rect x="131" y="64" fill="#FFFFFF" width="20" height="35" />
                                        <path d="M148.6 62.8c4.9 4.6 8.4 9.4 10.6 14.2-3.4-.1-6.8-.1-10.1.1 4 3.7 6.8 7.6 8.2 11.6-2.1 0-4.2 0-6.3.2 2.6 4.1 3.8 8.3 3.7 12.5-1.2-.7-3.4-1.4-5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </g>
                                <path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46" />
                                <path className="hair" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474" />
                                <g className="eyebrow">
                                    <path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z" />
                                    <path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599" />
                                </g>
                                <g className="eyeL">
                                    <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
                                    <circle cx="84" cy="76" r="1" fill="#fff" />
                                </g>
                                <g className="eyeR">
                                    <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
                                    <circle cx="113" cy="76" r="1" fill="#fff" />
                                </g>
                                <g className="mouth">
                                    {/* Simplified mouth without MorphSVG for now - using medium as default */}
                                    <path className="mouthBG" fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                    <defs>
                                        <path id="mouthMaskPath" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                    </defs>
                                    <clipPath id="mouthMask">
                                        <use xlinkHref="#mouthMaskPath" overflow="visible" />
                                    </clipPath>
                                    <g clipPath="url(#mouthMask)">
                                        <g className="tongue">
                                            <circle cx="100" cy="107" r="8" fill="#cc4a6c" />
                                            <ellipse className="tongueHighlight" cx="100" cy="100.5" rx="3" ry="1.5" opacity=".1" fill="#fff" />
                                        </g>
                                    </g>
                                    <path clipPath="url(#mouthMask)" className="tooth" style={{ fill: '#FFFFFF' }} d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z" />
                                    <path className="mouthOutline" fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                                </g>
                                <path className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77" />
                                <g className="arms" clipPath="url(#armMask)">
                                    <g className="armL">
                                        <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M121.3 97.4L111 58.7l38.8-10.4 20 36.1z" />
                                        <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M134.4 52.5l19.3-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1L146 59.7M160.8 76.5l19.4-5.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-18.3 4.9M158.3 66.8l23.1-6.2c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-23.1 6.2M150.9 58.4l26-7c2.7-.7 5.4.9 6.1 3.5.7 2.7-.9 5.4-3.5 6.1l-21.3 5.7" />
                                        <path fill="#a9ddf3" d="M178.8 74.7l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zM180.1 64l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zM175.5 54.9l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8zM152.1 49.4l2.2-.6c1.1-.3 2.2.3 2.4 1.4.3 1.1-.3 2.2-1.4 2.4l-2.2.6-1-3.8z" />
                                        <path fill="#fff" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M123.5 96.8c-41.4 14.9-84.1 30.7-108.2 35.5L1.2 80c33.5-9.9 71.9-16.5 111.9-21.8" />
                                        <path fill="#fff" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M108.5 59.4c7.7-5.3 14.3-8.4 22.8-13.2-2.4 5.3-4.7 10.3-6.7 15.1 4.3.3 8.4.7 12.3 1.3-4.2 5-8.1 9.6-11.5 13.9 3.1 1.1 6 2.4 8.7 3.8-1.4 2.9-2.7 5.8-3.9 8.5 2.5 3.5 4.6 7.2 6.3 11-4.9-.8-9-.7-16.2-2.7M94.5 102.8c-.6 4-3.8 8.9-9.4 14.7-2.6-1.8-5-3.7-7.2-5.7-2.5 4.1-6.6 8.8-12.2 14-1.9-2.2-3.4-4.5-6.9-4.4 3.3-9.5 6.9-15.4 10.8-.2-3.4.1-7.1 1.1-10.9M97.5 62.9c-1.7-2.4-5.9-4.1-12.4-5.2-.9 2.2-1.8 4.3-2.5 6.5-3.8-1.8-9.4-3.1-17-3.8.5 2.3 1.2 4.5 1.9 6.8-5-.6-11.2-.9-18.4-1 2 2.9.9 3.5 3.9 6.2" />
                                    </g>
                                    <g className="armR">
                                        <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z" />
                                        <path fill="#ddf1fa" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7" />
                                        <path fill="#a9ddf3" d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z" />
                                        <path fill="#fff" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1" />
                                        <path fill="#fff" stroke="#3a5e77" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M278.2 59.3l-18.6-10 2.5 11.9-10.7 6.5 9.9 8.7-13.9 6.4 9.1 5.9-13.2 9.2 23.1-.9M284.5 100.1c-.4 4 1.8 8.9 6.7 14.8 3.5-1.8 6.7-3.6 9.7-5.5 1.8 4.2 5.1 8.9 10.1 14.1 2.7-2.1 5.1-4.4 7.1-6.8 4.1 3.4 9 7 14.7 11 1.2-3.4 1.8-7 1.7-10.9M314 66.7s5.4-5.7 12.6-7.4c1.7 2.9 3.3 5.7 4.9 8.6 3.8-2.5 9.8-4.4 18.2-5.7.1 3.1.1 6.1 0 9.2 5.5-1 12.5-1.6 20.8-1.9-1.4 3.9-2.5 8.4-2.5 8.4" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 p-2">
                        <div className="text-center mb-2">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Bem-vindo</h2>
                            <p className="text-sm text-slate-500 text-blue-100">Entre com suas credenciais para continuar.</p>
                        </div>

                        <ModernInput
                            label="Email"
                            id="email"
                            type="email"
                            ref={emailRef}
                            maxLength={256}
                            value={email}
                            onChange={handleEmailInput}
                            onFocus={handleEmailFocus}
                            onBlur={handleEmailBlur}
                            placeholder="admin@sorvete.com"
                        />

                        <ModernInput
                            label="Senha"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            placeholder="••••••••"
                        />

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center">
                                <p className="text-red-300 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <ModernButton
                            type="submit"
                            variant="primary"
                            icon={LogIn}
                            isLoading={loading}
                            className="w-full mt-2"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </ModernButton>
                    </form>
                </GlassCard>
            </div>
        </LayoutWrapper>
    );
}
