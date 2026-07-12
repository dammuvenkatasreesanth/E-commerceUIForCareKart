import svgPaths from "./svg-mrn5tebmzt";
import imgImageMedicalGradeNitrileGloves from "./0618c73c0fd5ca9c0a3cc2e20eb36fb8ebe5ff4e.png";
import imgImageMedicalGloves from "./5f3d77342e755ac73a0887cb0cb4c3de54018121.png";
import imgImageSurgicalGloves from "./85e2fd11b1e1ec375e5b2b5d6212f268e89a2025.png";
import imgImageFaceMasks from "./695d5298535e7a1966d3f7b2b11d3faf582f12c3.png";
import imgImagePpeKits from "./6f2069019bc727494435c7b930bf02bb4a72f0c8.png";
import imgImageSanitizers from "./55bfc50f33e0494ec26664921ec70ceb398979b3.png";
import imgImageLabCoats from "./637b90dd7628417dbdbda1564328cd9a8e67ca42.png";
import imgImageSafetyBoots from "./7e22642eb8994afae63bf913cc4e4a32e84d5361.png";
import imgImageNitrileGuardPro35G from "./9c8029a01369b24b808ff1833eda68a4927b5127.png";
import imgImageLatexShieldSurgical75G from "./8b836f41a7bf66d2b4fbd0a52d9817683093a22d.png";
import imgImageVinylCareExaminationClear from "./cf1ab2b7c271c21c3be10293b49b1d6d0fb6b082.png";
import imgImageN95RespiratorProFit from "./88a75e38ac0aeaddacadf253ae243c0a6d38c746.png";
import imgImageHygieneGuardSanitizer70Ipa from "./8dbf17c5b2871e68ce5601a2e83e4bd0689c0260.png";
import imgImageFoodGuardPolyGloves from "./13209470330be70a964431d3769a15fef435f051.png";
import imgImageShieldProPpeCompleteKit from "./2a17f545520ad6df9190a6a7f17d6152b074c035.png";

function Text() {
  return (
    <div className="absolute h-[15px] left-[464.61px] opacity-90 top-[12px] w-[427.938px]" data-name="Text">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[214px] text-[12px] text-center text-white top-[-1px] whitespace-nowrap">{`Free shipping on orders above ₹2,000 | ISO 13485 Certified Manufacturer | `}</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[24px] left-[892.55px] top-[6px] w-[191.844px]" data-name="Button">
      <p className="-translate-x-1/2 [text-underline-position:from-font] [word-break:break-word] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[24px] left-[96.5px] text-[16px] text-center text-white top-[-1px] underline whitespace-nowrap">B2B Registration Open →</p>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#1741b0] h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Button />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25fc4100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3e012060} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#1741b0] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] relative rounded-[10px] shrink-0 size-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[0] left-[61.47px] text-[#1741b0] text-[20px] text-center top-[-5px] whitespace-nowrap">
          <span className="leading-[20px]">Care</span>
          <span className="leading-[20px] text-[#0d9488]">Kart</span>
        </p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[9px] relative shrink-0 text-[#6b7280] text-[9px] text-center tracking-[0.9px] uppercase whitespace-nowrap">Certified Protection</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-[122.547px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container4 />
        <Paragraph />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container2 />
        <Container3 />
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[#f3f6fb] h-[42px] left-0 rounded-[10px] top-0 w-[867.156px]" data-name="Text Input">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip pl-[17px] pr-[49px] py-[11px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-[rgba(17,24,39,0.5)] w-full">Search gloves, PPE, masks, sanitizers...</p>
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#1741b0] content-stretch flex h-[42px] items-center left-[819.16px] px-[16px] rounded-br-[10px] rounded-tr-[10px] top-0" data-name="Button">
      <Icon1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[867.156_0_0] h-[42px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <TextInput />
        <Button2 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#111827] text-[14px] text-center whitespace-nowrap">Account</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative rounded-[10px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[8px] relative size-full">
        <Icon2 />
        <Text1 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_8_1189)" id="Icon">
          <path d={svgPaths.p32514c00} id="Vector" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2734ea00} id="Vector_2" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p24a52d80} id="Vector_3" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1189">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#111827] text-[14px] text-center whitespace-nowrap">Cart</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[10px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[8px] relative size-full">
        <Icon3 />
        <Text2 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center max-w-[1280px] px-[16px] py-[12px] relative shrink-0" data-name="Container">
      <Button1 />
      <Container5 />
      <Container6 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[14px] py-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#111827] text-[14px] text-center whitespace-nowrap">Medical Gloves</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[14px] py-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#111827] text-[14px] text-center whitespace-nowrap">Industrial Gloves</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[14px] py-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#111827] text-[14px] text-center whitespace-nowrap">PPE Kits</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[14px] py-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#111827] text-[14px] text-center whitespace-nowrap">Face Masks</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[14px] py-[6px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#111827] text-[14px] text-center whitespace-nowrap">Sanitizers</p>
      </div>
    </div>
  );
}

function Container8() {
  return <div className="flex-[451.203_0_0] h-0 min-w-px relative" data-name="Container" />;
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1122)" id="Icon">
          <path d={svgPaths.p38014980} id="Vector" stroke="var(--stroke-0, #0D9488)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pb95800} id="Vector_2" stroke="var(--stroke-0, #0D9488)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1914c880} id="Vector_3" stroke="var(--stroke-0, #0D9488)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 3.5H8.16667" id="Vector_4" stroke="var(--stroke-0, #0D9488)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 5.83333H8.16667" id="Vector_5" stroke="var(--stroke-0, #0D9488)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 8.16667H8.16667" id="Vector_6" stroke="var(--stroke-0, #0D9488)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 10.5H8.16667" id="Vector_7" stroke="var(--stroke-0, #0D9488)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1122">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative rounded-[33554400px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#0d9488] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center px-[18px] py-[8px] relative size-full">
        <Icon4 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#0d9488] text-[14px] text-center whitespace-nowrap">B2B Portal</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p16dcb0} id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p29a9aa00} id="Vector_2" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p9f2bd80} id="Vector_3" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p13c0200} id="Vector_4" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex gap-[6px] items-center px-[18px] py-[8px] relative rounded-[33554400px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border-2 border-[#ff8904] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <Icon5 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#f54900] text-[14px] text-center whitespace-nowrap">Admin</p>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pl-[8px] relative size-full">
        <Button11 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[2px] h-[44px] items-center max-w-[1280px] overflow-clip px-[16px] py-[4px] relative shrink-0 w-[1280px]" data-name="Container">
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Container8 />
      <Button10 />
      <ButtonMargin />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Navigation">
      <div aria-hidden className="absolute border-[rgba(0,0,0,0.09)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-px relative size-full">
        <ContainerMargin1 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] relative shrink-0 w-full" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container />
        <ContainerMargin />
        <Navigation />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1181)" id="Icon">
          <path d={svgPaths.p10070800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24f94f00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1181">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] content-stretch flex gap-[6px] items-center left-0 px-[13px] py-[7px] rounded-[33554400px] top-0" data-name="Text">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <Icon6 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">ISO 13485 Certified</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text3 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.6)] tracking-[1.4px] uppercase whitespace-nowrap">New Season Collection</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[60px] relative shrink-0 text-[48px] text-white w-[608px]">Medical-Grade Nitrile Gloves</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[36px] max-w-[448px] relative shrink-0 w-[448px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] pt-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.7)] whitespace-nowrap">Trusted by 5,000+ healthcare facilities across India</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-white h-full relative rounded-[14px] shrink-0" data-name="Button">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#1741b0] text-[14px] text-center whitespace-nowrap">Shop Medical →</p>
        </div>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="h-full relative rounded-[14px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[25px] py-[13px] relative size-full">
          <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">B2B Pricing</p>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[70px] relative shrink-0 w-[608px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start pt-[24px] relative size-full">
        <Button12 />
        <Button13 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] relative shrink-0 text-[24px] text-white whitespace-nowrap">5,000+</p>
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] whitespace-nowrap">Facilities</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-[90.688px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] relative shrink-0 text-[24px] text-white whitespace-nowrap">50M+</p>
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] whitespace-nowrap">Gloves/Year</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-[69.703px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] relative shrink-0 text-[24px] text-white whitespace-nowrap">99.9%</p>
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.5)] whitespace-nowrap">Quality Pass Rate</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-[97.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[80px] relative shrink-0 w-[608px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center pt-[32px] relative size-full">
        <Container16 />
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[608_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container13 />
        <Paragraph1 />
        <Heading />
        <Paragraph2 />
        <Container14 />
        <Container15 />
      </div>
    </div>
  );
}

function ImageMedicalGradeNitrileGloves() {
  return (
    <div
      className="h-[288px] relative rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] shrink-0 w-[608px]"
      data-name="Image (Medical-Grade
Nitrile Gloves)"
    >
      <div aria-hidden className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 pointer-events-none rounded-[16px]">
        <div className="absolute bg-[rgba(255,255,255,0)] bg-clip-padding border-0 border-[transparent] border-solid inset-0 rounded-[16px]" />
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid max-w-none object-cover rounded-[16px] size-full" src={imgImageMedicalGradeNitrileGloves} />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-[#fdc700] drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] left-[453.33px] rounded-[14px] top-[264px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[16px] py-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#733e0a] text-[14px] whitespace-nowrap">20% off bulk orders</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[608_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ImageMedicalGradeNitrileGloves />
        <Container20 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-[1280px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-center max-w-[inherit] px-[16px] py-[64px] relative size-full">
        <Container12 />
        <Container19 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" style={{ backgroundImage: "linear-gradient(161.843deg, rgb(15, 44, 110) 0%, rgb(23, 65, 176) 100%)" }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container11 />
      </div>
    </div>
  );
}

function Button14() {
  return <div className="bg-white h-[10px] relative rounded-[33554400px] shrink-0 w-[24px]" data-name="Button" />;
}

function Button15() {
  return <div className="bg-[rgba(255,255,255,0.4)] relative rounded-[33554400px] shrink-0 size-[10px]" data-name="Button" />;
}

function Button16() {
  return <div className="bg-[rgba(255,255,255,0.4)] relative rounded-[33554400px] shrink-0 size-[10px]" data-name="Button" />;
}

function Container21() {
  return (
    <div className="absolute left-[744.5px] top-[478px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button14 />
        <Button15 />
        <Button16 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] left-[12px] rounded-[33554400px] size-[32px] top-[238px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] left-[1505px] rounded-[33554400px] size-[32px] top-[238px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[508px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container10 />
        <Container21 />
        <Button17 />
        <Button18 />
      </div>
    </div>
  );
}

function Container25() {
  return <div className="bg-[rgba(0,0,0,0.09)] flex-[499.422_0_0] h-px min-w-px relative" data-name="Container" />;
}

function Paragraph9() {
  return (
    <div className="relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">{`Certifications & Compliance`}</p>
      </div>
    </div>
  );
}

function Container26() {
  return <div className="bg-[rgba(0,0,0,0.09)] flex-[499.438_0_0] h-px min-w-px relative" data-name="Container" />;
}

function Container24() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container25 />
        <Paragraph9 />
        <Container26 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[12px] relative shrink-0 text-[#111827] text-[12px] whitespace-nowrap">ISO 13485</p>
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[17px] relative shrink-0 w-[62.688px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">Medical QMS</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-[62.688px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph10 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[#f3f6fb] h-full relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
          <Container29 />
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #1447E6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[12px] relative shrink-0 text-[#111827] text-[12px] whitespace-nowrap">CE Marked</p>
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[17px] relative shrink-0 w-[101.813px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">European Conformity</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-[101.813px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph12 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="bg-[#f3f6fb] h-full relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
          <Container32 />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-[#dcfce7] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[12px] relative shrink-0 text-[#111827] text-[12px] whitespace-nowrap">FDA 510(k)</p>
      </div>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[17px] relative shrink-0 w-[64.016px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">US Clearance</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-[64.016px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph14 />
        <Paragraph15 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[#f3f6fb] h-full relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
          <Container35 />
          <Container36 />
        </div>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #CA3500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #CA3500)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-[#ffedd4] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[12px] relative shrink-0 text-[#111827] text-[12px] whitespace-nowrap">BIS Certified</p>
      </div>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[17px] relative shrink-0 w-[126.844px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">Bureau of Indian Standards</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 w-[126.844px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph16 />
        <Paragraph17 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-[#f3f6fb] h-full relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
          <Container38 />
          <Container39 />
        </div>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #00786F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-[#cbfbf1] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[12px] relative shrink-0 text-[#111827] text-[12px] whitespace-nowrap">WHO GMP</p>
      </div>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[17px] relative shrink-0 w-[139.75px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">Good Manufacturing Practice</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 w-[139.75px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph18 />
        <Paragraph19 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-[#f3f6fb] h-full relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
          <Container41 />
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #314158)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #314158)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-[#f1f5f9] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[12px] relative shrink-0 text-[#111827] text-[12px] whitespace-nowrap">EN 388:2016</p>
      </div>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[17px] relative shrink-0 w-[74.875px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">Mechanical Risk</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-[74.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph20 />
        <Paragraph21 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="bg-[#f3f6fb] h-full relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
          <Container44 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #C10007)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #C10007)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-[#ffe2e2] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon15 />
      </div>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[12px] relative shrink-0 text-[#111827] text-[12px] whitespace-nowrap">NIOSH N95</p>
      </div>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[17px] relative shrink-0 w-[94.75px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] whitespace-nowrap">Respirator Standard</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 w-[94.75px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph22 />
        <Paragraph23 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="bg-[#f3f6fb] h-full relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[13px] py-[9px] relative size-full">
          <Container47 />
          <Container48 />
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[62px] relative shrink-0 w-[1248px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start justify-center pt-[12px] relative size-full">
        <Container28 />
        <Container31 />
        <Container34 />
        <Container37 />
        <Container40 />
        <Container43 />
        <Container46 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[1280px] p-[16px] relative shrink-0 w-[1280px]" data-name="Container">
      <Container24 />
      <Container27 />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container23 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[rgba(0,0,0,0.09)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative size-full">
        <ContainerMargin2 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[#111827] text-[20px] whitespace-nowrap">Explore Product Categories</p>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[2px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#1741b0] text-[14px] text-center whitespace-nowrap">View All</p>
        <Icon16 />
      </div>
    </div>
  );
}

function SectionHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="SectionHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Heading1 />
        <Button19 />
      </div>
    </div>
  );
}

function ImageMedicalGloves() {
  return (
    <div className="h-[141.5px] relative shrink-0 w-full" data-name="Image (Medical Gloves)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageMedicalGloves} />
    </div>
  );
}

function Container51() {
  return (
    <div className="bg-[#f3f6fb] relative rounded-[33554400px] shrink-0 size-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImageMedicalGloves />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-0 top-0" data-name="Button">
      <Container51 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#111827] text-[12px] text-center whitespace-nowrap">Medical Gloves</p>
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">48 products</p>
    </div>
  );
}

function ImageSurgicalGloves() {
  return (
    <div className="h-[141.5px] relative shrink-0 w-full" data-name="Image (Surgical Gloves)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageSurgicalGloves} />
    </div>
  );
}

function Container52() {
  return (
    <div className="bg-[#f3f6fb] relative rounded-[33554400px] shrink-0 size-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImageSurgicalGloves />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button21() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[157.5px] top-0" data-name="Button">
      <Container52 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#111827] text-[12px] text-center whitespace-nowrap">Surgical Gloves</p>
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">24 products</p>
    </div>
  );
}

function ImageIndustrialGloves() {
  return <div className="h-[141.5px] relative shrink-0 w-full" data-name="Image (Industrial Gloves)" />;
}

function Container53() {
  return (
    <div className="bg-[#f3f6fb] relative rounded-[33554400px] shrink-0 size-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImageIndustrialGloves />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[315px] top-0" data-name="Button">
      <Container53 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#111827] text-[12px] text-center whitespace-nowrap">Industrial Gloves</p>
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">36 products</p>
    </div>
  );
}

function ImageFaceMasks() {
  return (
    <div className="h-[141.5px] relative shrink-0 w-full" data-name="Image (Face Masks)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageFaceMasks} />
    </div>
  );
}

function Container54() {
  return (
    <div className="bg-[#f3f6fb] relative rounded-[33554400px] shrink-0 size-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImageFaceMasks />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[472.5px] top-0" data-name="Button">
      <Container54 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#111827] text-[12px] text-center whitespace-nowrap">Face Masks</p>
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">19 products</p>
    </div>
  );
}

function ImagePpeKits() {
  return (
    <div className="h-[141.5px] relative shrink-0 w-full" data-name="Image (PPE Kits)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImagePpeKits} />
    </div>
  );
}

function Container55() {
  return (
    <div className="bg-[#f3f6fb] relative rounded-[33554400px] shrink-0 size-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImagePpeKits />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[630px] top-0" data-name="Button">
      <Container55 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#111827] text-[12px] text-center whitespace-nowrap">PPE Kits</p>
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">12 products</p>
    </div>
  );
}

function ImageSanitizers() {
  return (
    <div className="h-[141.5px] relative shrink-0 w-full" data-name="Image (Sanitizers)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageSanitizers} />
    </div>
  );
}

function Container56() {
  return (
    <div className="bg-[#f3f6fb] relative rounded-[33554400px] shrink-0 size-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImageSanitizers />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button25() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[787.5px] top-0" data-name="Button">
      <Container56 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#111827] text-[12px] text-center whitespace-nowrap">Sanitizers</p>
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">31 products</p>
    </div>
  );
}

function ImageLabCoats() {
  return (
    <div className="h-[141.5px] relative shrink-0 w-full" data-name="Image (Lab Coats)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageLabCoats} />
    </div>
  );
}

function Container57() {
  return (
    <div className="bg-[#f3f6fb] relative rounded-[33554400px] shrink-0 size-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImageLabCoats />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[945px] top-0" data-name="Button">
      <Container57 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#111827] text-[12px] text-center whitespace-nowrap">Lab Coats</p>
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">22 products</p>
    </div>
  );
}

function ImageSafetyBoots() {
  return (
    <div className="h-[141.5px] relative shrink-0 w-full" data-name="Image (Safety Boots)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageSafetyBoots} />
    </div>
  );
}

function Container58() {
  return (
    <div className="bg-[#f3f6fb] relative rounded-[33554400px] shrink-0 size-[145.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImageSafetyBoots />
      </div>
      <div aria-hidden className="absolute border-2 border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[33554400px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Button27() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[1102.5px] top-0" data-name="Button">
      <Container58 />
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#111827] text-[12px] text-center whitespace-nowrap">Safety Boots</p>
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[15px] relative shrink-0 text-[#6b7280] text-[10px] text-center whitespace-nowrap">14 products</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[191.5px] relative shrink-0 w-full" data-name="Container">
      <Button20 />
      <Button21 />
      <Button22 />
      <Button23 />
      <Button24 />
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function ContainerMargin4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <Container50 />
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <SectionHeader />
        <ContainerMargin4 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[#111827] text-[20px] whitespace-nowrap">{`Today's Best Sellers`}</p>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button28() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[2px] items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#1741b0] text-[14px] text-center whitespace-nowrap">See All Products</p>
        <Icon17 />
      </div>
    </div>
  );
}

function SectionHeader1() {
  return (
    <div className="relative shrink-0 w-full" data-name="SectionHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Heading2 />
        <Button28 />
      </div>
    </div>
  );
}

function ImageNitrileGuardPro35G() {
  return (
    <div className="h-[298px] relative shrink-0 w-full" data-name="Image (NitrileGuard Pro 3.5g)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageNitrileGuardPro35G} />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[#1741b0] left-[8px] rounded-[8px] top-[8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">Bestseller</p>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button29() {
  return (
    <div className="absolute bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] left-[262px] rounded-[33554400px] size-[28px] top-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="bg-[#f3f6fb] h-[298px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageNitrileGuardPro35G />
        <Text4 />
        <Button29 />
      </div>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Medical Gloves</p>
      </div>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="content-stretch flex flex-col h-[17.5px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[17.5px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">NitrileGuard Pro 3.5g</p>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Paragraph25 />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[16px] relative shrink-0 w-[21px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">4.8</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">(342)</p>
      </div>
    </div>
  );
}

function StarRating() {
  return (
    <div className="h-[20px] relative shrink-0 w-[274px]" data-name="StarRating">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[4px] relative size-full">
        <Icon19 />
        <Icon20 />
        <Icon21 />
        <Icon22 />
        <Icon23 />
        <Text5 />
        <Text6 />
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="[word-break:break-word] h-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1741b0] text-[16px] top-0">₹12.99</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[60.3px] line-through text-[#6b7280] text-[12px] top-[6px]">₹15.59</p>
    </div>
  );
}

function ContainerMargin6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container62 />
      </div>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[18px] relative shrink-0 w-[274px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d9488] text-[12px] whitespace-nowrap">B2B from ₹9.09/unit</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Paragraph24 />
        <ParagraphMargin />
        <StarRating />
        <ContainerMargin6 />
        <Paragraph26 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1140)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2bf13500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1140">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 w-[274px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center py-[8px] relative size-full">
        <Icon24 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Add to Cart</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] px-[12px] relative size-full">
        <Button30 />
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <div className="absolute bg-white h-[473.5px] left-0 rounded-[14px] top-0 w-[300px]" data-name="ProductCard">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container60 />
        <Container61 />
        <Container63 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function ImageLatexShieldSurgical75G() {
  return (
    <div className="h-[298px] relative shrink-0 w-full" data-name="Image (LatexShield Surgical 7.5g)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageLatexShieldSurgical75G} />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[#1741b0] left-[8px] rounded-[8px] top-[8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">Top Rated</p>
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button31() {
  return (
    <div className="absolute bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] left-[262px] rounded-[33554400px] size-[28px] top-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="bg-[#f3f6fb] h-[298px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageLatexShieldSurgical75G />
        <Text7 />
        <Button31 />
      </div>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Surgical Gloves</p>
      </div>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="content-stretch flex flex-col h-[17.5px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[17.5px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">LatexShield Surgical 7.5g</p>
    </div>
  );
}

function ParagraphMargin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Paragraph28 />
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[21px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">4.9</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">(218)</p>
      </div>
    </div>
  );
}

function StarRating1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[274px]" data-name="StarRating">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[4px] relative size-full">
        <Icon26 />
        <Icon27 />
        <Icon28 />
        <Icon29 />
        <Icon30 />
        <Text8 />
        <Text9 />
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="[word-break:break-word] h-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1741b0] text-[16px] top-0">₹18.49</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[61.7px] line-through text-[#6b7280] text-[12px] top-[6px]">₹22.19</p>
    </div>
  );
}

function ContainerMargin7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container66 />
      </div>
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="h-[18px] relative shrink-0 w-[274px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d9488] text-[12px] whitespace-nowrap">B2B from ₹13.49/unit</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Paragraph27 />
        <ParagraphMargin1 />
        <StarRating1 />
        <ContainerMargin7 />
        <Paragraph29 />
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1140)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2bf13500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1140">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button32() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 w-[274px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center py-[8px] relative size-full">
        <Icon31 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Add to Cart</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] px-[12px] relative size-full">
        <Button32 />
      </div>
    </div>
  );
}

function ProductCard1() {
  return (
    <div className="absolute bg-white h-[473.5px] left-[316px] rounded-[14px] top-0 w-[300px]" data-name="ProductCard">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container64 />
        <Container65 />
        <Container67 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function ImageIndustrialMaxCutResistA() {
  return <div className="h-[298px] relative shrink-0 w-full" data-name="Image (IndustrialMax Cut-Resist A4)" />;
}

function Text10() {
  return (
    <div className="absolute bg-[#1741b0] left-[8px] rounded-[8px] top-[8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">Industrial Grade</p>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button33() {
  return (
    <div className="absolute bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] left-[262px] rounded-[33554400px] size-[28px] top-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="bg-[#f3f6fb] h-[298px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageIndustrialMaxCutResistA />
        <Text10 />
        <Button33 />
      </div>
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Industrial Gloves</p>
      </div>
    </div>
  );
}

function Paragraph31() {
  return (
    <div className="content-stretch flex flex-col h-[17.5px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[17.5px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">IndustrialMax Cut-Resist A4</p>
    </div>
  );
}

function ParagraphMargin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Paragraph31 />
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[16px] relative shrink-0 w-[21px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">4.6</p>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">(189)</p>
      </div>
    </div>
  );
}

function StarRating2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[274px]" data-name="StarRating">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[4px] relative size-full">
        <Icon33 />
        <Icon34 />
        <Icon35 />
        <Icon36 />
        <Icon37 />
        <Text11 />
        <Text12 />
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="[word-break:break-word] h-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1741b0] text-[16px] top-0">₹24.99</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[64.16px] line-through text-[#6b7280] text-[12px] top-[6px]">₹29.99</p>
    </div>
  );
}

function ContainerMargin8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container70 />
      </div>
    </div>
  );
}

function Paragraph32() {
  return (
    <div className="h-[18px] relative shrink-0 w-[274px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d9488] text-[12px] whitespace-nowrap">B2B from ₹17.99/unit</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Paragraph30 />
        <ParagraphMargin2 />
        <StarRating2 />
        <ContainerMargin8 />
        <Paragraph32 />
      </div>
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1140)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2bf13500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1140">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button34() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 w-[274px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center py-[8px] relative size-full">
        <Icon38 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Add to Cart</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] px-[12px] relative size-full">
        <Button34 />
      </div>
    </div>
  );
}

function ProductCard2() {
  return (
    <div className="absolute bg-white h-[473.5px] left-[632px] rounded-[14px] top-0 w-[300px]" data-name="ProductCard">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container68 />
        <Container69 />
        <Container71 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function ImageVinylCareExaminationClear() {
  return (
    <div className="h-[298px] relative shrink-0 w-full" data-name="Image (VinylCare Examination Clear)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageVinylCareExaminationClear} />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute bg-[#1741b0] left-[8px] rounded-[8px] top-[8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">Value Pack</p>
      </div>
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button35() {
  return (
    <div className="absolute bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] left-[262px] rounded-[33554400px] size-[28px] top-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon39 />
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="bg-[#f3f6fb] h-[298px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageVinylCareExaminationClear />
        <Text13 />
        <Button35 />
      </div>
    </div>
  );
}

function Paragraph33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Medical Gloves</p>
      </div>
    </div>
  );
}

function Paragraph34() {
  return (
    <div className="content-stretch flex flex-col h-[17.5px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[17.5px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">VinylCare Examination Clear</p>
    </div>
  );
}

function ParagraphMargin3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Paragraph34 />
      </div>
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[16px] relative shrink-0 w-[21px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">4.5</p>
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">(456)</p>
      </div>
    </div>
  );
}

function StarRating3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[274px]" data-name="StarRating">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[4px] relative size-full">
        <Icon40 />
        <Icon41 />
        <Icon42 />
        <Icon43 />
        <Icon44 />
        <Text14 />
        <Text15 />
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="[word-break:break-word] h-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1741b0] text-[16px] top-0">₹8.99</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[54.42px] line-through text-[#6b7280] text-[12px] top-[6px]">₹10.79</p>
    </div>
  );
}

function ContainerMargin9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container74 />
      </div>
    </div>
  );
}

function Paragraph35() {
  return (
    <div className="h-[18px] relative shrink-0 w-[274px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d9488] text-[12px] whitespace-nowrap">B2B from ₹5.99/unit</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Paragraph33 />
        <ParagraphMargin3 />
        <StarRating3 />
        <ContainerMargin9 />
        <Paragraph35 />
      </div>
    </div>
  );
}

function Icon45() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1140)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2bf13500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1140">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button36() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 w-[274px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center py-[8px] relative size-full">
        <Icon45 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Add to Cart</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] px-[12px] relative size-full">
        <Button36 />
      </div>
    </div>
  );
}

function ProductCard3() {
  return (
    <div className="absolute bg-white h-[473.5px] left-[948px] rounded-[14px] top-0 w-[300px]" data-name="ProductCard">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container72 />
        <Container73 />
        <Container75 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function ImageN95RespiratorProFit() {
  return (
    <div className="h-[298px] relative shrink-0 w-full" data-name="Image (N95 Respirator ProFit)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageN95RespiratorProFit} />
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute bg-[#1741b0] left-[8px] rounded-[8px] top-[8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">Top Seller</p>
      </div>
    </div>
  );
}

function Icon46() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button37() {
  return (
    <div className="absolute bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] left-[262px] rounded-[33554400px] size-[28px] top-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon46 />
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="bg-[#f3f6fb] h-[298px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageN95RespiratorProFit />
        <Text16 />
        <Button37 />
      </div>
    </div>
  );
}

function Paragraph36() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Face Masks</p>
      </div>
    </div>
  );
}

function Paragraph37() {
  return (
    <div className="content-stretch flex flex-col h-[17.5px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[17.5px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">N95 Respirator ProFit</p>
    </div>
  );
}

function ParagraphMargin4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Paragraph37 />
      </div>
    </div>
  );
}

function Icon47() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon48() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon49() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon50() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon51() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[16px] relative shrink-0 w-[20px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">4.7</p>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">(891)</p>
      </div>
    </div>
  );
}

function StarRating4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[274px]" data-name="StarRating">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[4px] relative size-full">
        <Icon47 />
        <Icon48 />
        <Icon49 />
        <Icon50 />
        <Icon51 />
        <Text17 />
        <Text18 />
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="[word-break:break-word] h-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1741b0] text-[16px] top-0">₹3.49</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[54.91px] line-through text-[#6b7280] text-[12px] top-[6px]">₹4.19</p>
    </div>
  );
}

function ContainerMargin10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container78 />
      </div>
    </div>
  );
}

function Paragraph38() {
  return (
    <div className="h-[18px] relative shrink-0 w-[274px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d9488] text-[12px] whitespace-nowrap">B2B from ₹2.09/unit</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Paragraph36 />
        <ParagraphMargin4 />
        <StarRating4 />
        <ContainerMargin10 />
        <Paragraph38 />
      </div>
    </div>
  );
}

function Icon52() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1140)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2bf13500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1140">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button38() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 w-[274px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center py-[8px] relative size-full">
        <Icon52 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Add to Cart</p>
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] px-[12px] relative size-full">
        <Button38 />
      </div>
    </div>
  );
}

function ProductCard4() {
  return (
    <div className="absolute bg-white h-[473.5px] left-0 rounded-[14px] top-[489.5px] w-[300px]" data-name="ProductCard">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container76 />
        <Container77 />
        <Container79 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function ImageHygieneGuardSanitizer70Ipa() {
  return (
    <div className="h-[298px] relative shrink-0 w-full" data-name="Image (HygieneGuard Sanitizer 70% IPA)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHygieneGuardSanitizer70Ipa} />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute bg-[#1741b0] left-[8px] rounded-[8px] top-[8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">70% Alcohol</p>
      </div>
    </div>
  );
}

function Icon53() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button39() {
  return (
    <div className="absolute bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] left-[262px] rounded-[33554400px] size-[28px] top-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon53 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="bg-[#f3f6fb] h-[298px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageHygieneGuardSanitizer70Ipa />
        <Text19 />
        <Button39 />
      </div>
    </div>
  );
}

function Paragraph39() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Sanitizers</p>
      </div>
    </div>
  );
}

function Paragraph40() {
  return (
    <div className="content-stretch flex flex-col h-[17.5px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[17.5px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">HygieneGuard Sanitizer 70% IPA</p>
    </div>
  );
}

function ParagraphMargin5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Paragraph40 />
      </div>
    </div>
  );
}

function Icon54() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon55() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon56() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon57() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon58() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[16px] relative shrink-0 w-[21px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">4.4</p>
      </div>
    </div>
  );
}

function Text21() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">(673)</p>
      </div>
    </div>
  );
}

function StarRating5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[274px]" data-name="StarRating">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[4px] relative size-full">
        <Icon54 />
        <Icon55 />
        <Icon56 />
        <Icon57 />
        <Icon58 />
        <Text20 />
        <Text21 />
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="[word-break:break-word] h-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1741b0] text-[16px] top-0">₹6.99</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[53.94px] line-through text-[#6b7280] text-[12px] top-[6px]">₹8.39</p>
    </div>
  );
}

function ContainerMargin11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container82 />
      </div>
    </div>
  );
}

function Paragraph41() {
  return (
    <div className="h-[18px] relative shrink-0 w-[274px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d9488] text-[12px] whitespace-nowrap">B2B from ₹4.49/unit</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Paragraph39 />
        <ParagraphMargin5 />
        <StarRating5 />
        <ContainerMargin11 />
        <Paragraph41 />
      </div>
    </div>
  );
}

function Icon59() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1140)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2bf13500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1140">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button40() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 w-[274px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center py-[8px] relative size-full">
        <Icon59 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Add to Cart</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] px-[12px] relative size-full">
        <Button40 />
      </div>
    </div>
  );
}

function ProductCard5() {
  return (
    <div className="absolute bg-white h-[473.5px] left-[316px] rounded-[14px] top-[489.5px] w-[300px]" data-name="ProductCard">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container80 />
        <Container81 />
        <Container83 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function ImageFoodGuardPolyGloves() {
  return (
    <div className="h-[298px] relative shrink-0 w-full" data-name="Image (FoodGuard Poly Gloves)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageFoodGuardPolyGloves} />
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute bg-[#1741b0] left-[8px] rounded-[8px] top-[8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">Food Grade</p>
      </div>
    </div>
  );
}

function Icon60() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button41() {
  return (
    <div className="absolute bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] left-[262px] rounded-[33554400px] size-[28px] top-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon60 />
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="bg-[#f3f6fb] h-[298px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageFoodGuardPolyGloves />
        <Text22 />
        <Button41 />
      </div>
    </div>
  );
}

function Paragraph42() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Food Safety</p>
      </div>
    </div>
  );
}

function Paragraph43() {
  return (
    <div className="content-stretch flex flex-col h-[17.5px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[17.5px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">FoodGuard Poly Gloves</p>
    </div>
  );
}

function ParagraphMargin6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Paragraph43 />
      </div>
    </div>
  );
}

function Icon61() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon62() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon63() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon64() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon65() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} id="Vector" stroke="var(--stroke-0, #D1D5DC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[16px] relative shrink-0 w-[21px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">4.3</p>
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">(234)</p>
      </div>
    </div>
  );
}

function StarRating6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[274px]" data-name="StarRating">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[4px] relative size-full">
        <Icon61 />
        <Icon62 />
        <Icon63 />
        <Icon64 />
        <Icon65 />
        <Text23 />
        <Text24 />
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="[word-break:break-word] h-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1741b0] text-[16px] top-0">₹5.99</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[54.14px] line-through text-[#6b7280] text-[12px] top-[6px]">₹7.19</p>
    </div>
  );
}

function ContainerMargin12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container86 />
      </div>
    </div>
  );
}

function Paragraph44() {
  return (
    <div className="h-[18px] relative shrink-0 w-[274px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d9488] text-[12px] whitespace-nowrap">B2B from ₹3.79/unit</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Paragraph42 />
        <ParagraphMargin6 />
        <StarRating6 />
        <ContainerMargin12 />
        <Paragraph44 />
      </div>
    </div>
  );
}

function Icon66() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1140)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2bf13500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1140">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button42() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 w-[274px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center py-[8px] relative size-full">
        <Icon66 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Add to Cart</p>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] px-[12px] relative size-full">
        <Button42 />
      </div>
    </div>
  );
}

function ProductCard6() {
  return (
    <div className="absolute bg-white h-[473.5px] left-[632px] rounded-[14px] top-[489.5px] w-[300px]" data-name="ProductCard">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container84 />
        <Container85 />
        <Container87 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function ImageShieldProPpeCompleteKit() {
  return (
    <div className="h-[298px] relative shrink-0 w-full" data-name="Image (ShieldPro PPE Complete Kit)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageShieldProPpeCompleteKit} />
    </div>
  );
}

function Text25() {
  return (
    <div className="absolute bg-[#1741b0] left-[8px] rounded-[8px] top-[8px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-white whitespace-nowrap">Complete Kit</p>
      </div>
    </div>
  );
}

function Icon67() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p168026f2} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button43() {
  return (
    <div className="absolute bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] left-[262px] rounded-[33554400px] size-[28px] top-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon67 />
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="bg-[#f3f6fb] h-[298px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageShieldProPpeCompleteKit />
        <Text25 />
        <Button43 />
      </div>
    </div>
  );
}

function Paragraph45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">PPE Kits</p>
      </div>
    </div>
  );
}

function Paragraph46() {
  return (
    <div className="content-stretch flex flex-col h-[17.5px] items-start overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[17.5px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">ShieldPro PPE Complete Kit</p>
    </div>
  );
}

function ParagraphMargin7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Paragraph46 />
      </div>
    </div>
  );
}

function Icon68() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon69() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon70() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon71() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Icon72() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p6932200} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[16px] relative shrink-0 w-[21px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">4.8</p>
      </div>
    </div>
  );
}

function Text27() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">(127)</p>
      </div>
    </div>
  );
}

function StarRating7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[274px]" data-name="StarRating">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pt-[4px] relative size-full">
        <Icon68 />
        <Icon69 />
        <Icon70 />
        <Icon71 />
        <Icon72 />
        <Text26 />
        <Text27 />
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="[word-break:break-word] h-[24px] relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1741b0] text-[16px] top-0">₹45.99</p>
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] left-[64.61px] line-through text-[#6b7280] text-[12px] top-[6px]">₹55.19</p>
    </div>
  );
}

function ContainerMargin13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container90 />
      </div>
    </div>
  );
}

function Paragraph47() {
  return (
    <div className="h-[18px] relative shrink-0 w-[274px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#0d9488] text-[12px] whitespace-nowrap">B2B from ₹32.99/unit</p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[12px] relative size-full">
        <Paragraph45 />
        <ParagraphMargin7 />
        <StarRating7 />
        <ContainerMargin13 />
        <Paragraph47 />
      </div>
    </div>
  );
}

function Icon73() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1140)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2bf13500} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1140">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button44() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 w-[274px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center justify-center py-[8px] relative size-full">
        <Icon73 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Add to Cart</p>
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] px-[12px] relative size-full">
        <Button44 />
      </div>
    </div>
  );
}

function ProductCard7() {
  return (
    <div className="absolute bg-white h-[473.5px] left-[948px] rounded-[14px] top-[489.5px] w-[300px]" data-name="ProductCard">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container88 />
        <Container89 />
        <Container91 />
      </div>
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[963px] relative shrink-0 w-full" data-name="Container">
      <ProductCard />
      <ProductCard1 />
      <ProductCard2 />
      <ProductCard3 />
      <ProductCard4 />
      <ProductCard5 />
      <ProductCard6 />
      <ProductCard7 />
    </div>
  );
}

function ContainerMargin5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <Container59 />
      </div>
    </div>
  );
}

function Section1() {
  return (
    <div className="h-[1055px] relative shrink-0 w-[1248px]" data-name="Section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[48px] relative size-full">
        <SectionHeader1 />
        <ContainerMargin5 />
      </div>
    </div>
  );
}

function Container94() {
  return <div className="absolute border-4 border-[rgba(255,255,255,0.5)] border-solid left-[682.66px] rounded-[33554400px] size-[128px] top-[16px]" data-name="Container" />;
}

function Container95() {
  return <div className="absolute border-4 border-[rgba(255,255,255,0.3)] border-solid left-[554.66px] rounded-[33554400px] size-[192px] top-[32px]" data-name="Container" />;
}

function Container93() {
  return (
    <div className="absolute h-[192px] left-0 opacity-10 top-0 w-[826.656px]" data-name="Container">
      <Container94 />
      <Container95 />
    </div>
  );
}

function Text28() {
  return (
    <div className="absolute bg-[#fdc700] h-[19px] left-0 rounded-[33554400px] top-[4px] w-[107.406px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[16px] left-[8px] text-[#733e0a] text-[12px] top-px whitespace-nowrap">B2B EXCLUSIVE</p>
    </div>
  );
}

function Button45() {
  return (
    <div className="absolute bg-[#fdc700] h-[36px] left-0 rounded-[14px] top-[104px] w-[190.766px]" data-name="Button">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] left-[95.5px] text-[#733e0a] text-[14px] text-center top-[8px] whitespace-nowrap">Become a B2B Partner</p>
    </div>
  );
}

function Container97() {
  return (
    <div className="flex-[658.656_0_0] h-[140px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text28 />
        <p className="[word-break:break-word] absolute font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] left-0 text-[24px] text-white top-[32px] whitespace-nowrap">Up to 30% off</p>
        <p className="[word-break:break-word] absolute font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-[rgba(255,255,255,0.7)] top-[68px] whitespace-nowrap">On bulk orders of 1,000+ units. Register as a verified retailer to unlock tiered pricing.</p>
        <Button45 />
      </div>
    </div>
  );
}

function Icon74() {
  return (
    <div className="relative shrink-0 size-[96px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 96 96">
        <g id="Icon">
          <path d={svgPaths.p27ba9000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="8" />
          <path d={svgPaths.pc099400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="8" />
          <path d={svgPaths.p1e35c440} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="8" />
          <path d="M40 24H56" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="8" />
          <path d="M40 40H56" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="8" />
          <path d="M40 56H56" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="8" />
          <path d="M40 72H56" id="Vector_7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.2" strokeWidth="8" />
        </g>
      </svg>
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute content-stretch flex gap-[24px] h-[192px] items-center left-0 p-[24px] top-0" data-name="Container">
      <Container97 />
      <Icon74 />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute h-[192px] left-0 overflow-clip rounded-[16px] top-0 w-[826.656px]" style={{ backgroundImage: "linear-gradient(166.924deg, rgb(23, 65, 176) 0%, rgb(15, 44, 110) 100%)" }} data-name="Container">
      <Container93 />
      <Container96 />
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)] border-solid h-[21px] left-0 rounded-[33554400px] top-[3px] w-[100.594px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[16px] left-[8px] text-[12px] text-white top-px whitespace-nowrap">COMBO DEAL</p>
    </div>
  );
}

function Container100() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text29 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[28px] relative shrink-0 text-[20px] text-white whitespace-nowrap">PPE Starter Kit</p>
    </div>
  );
}

function Heading3Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Heading3 />
      </div>
    </div>
  );
}

function Paragraph48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(255,255,255,0.7)] whitespace-nowrap">Gloves + Mask + Sanitizer + Face Shield</p>
    </div>
  );
}

function ParagraphMargin8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <Paragraph48 />
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container100 />
        <Heading3Margin />
        <ParagraphMargin8 />
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] bg-clip-padding border-0 border-[transparent] border-solid relative size-full whitespace-nowrap">
        <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[36px] left-0 text-[30px] text-white top-0">₹999</p>
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-from-font decoration-solid font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[20px] left-[82.98px] line-through text-[14px] text-[rgba(255,255,255,0.5)] top-[14px]">₹1,499</p>
      </div>
    </div>
  );
}

function Button46() {
  return (
    <div className="absolute bg-white h-[32px] left-0 rounded-[10px] top-[8px] w-[92.109px]" data-name="Button">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[16px] left-[46.5px] text-[#00786f] text-[12px] text-center top-[7px] whitespace-nowrap">Shop Now</p>
    </div>
  );
}

function Container103() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button46 />
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container102 />
        <Container103 />
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute content-stretch flex flex-col h-[192px] items-start justify-between left-[842.66px] overflow-clip p-[24px] rounded-[16px] top-0 w-[405.344px]" style={{ backgroundImage: "linear-gradient(154.654deg, rgb(13, 148, 136) 0%, rgb(6, 95, 70) 100%)" }} data-name="Container">
      <Container99 />
      <Container101 />
    </div>
  );
}

function Section2() {
  return (
    <div className="h-[192px] relative shrink-0 w-full" data-name="Section">
      <Container92 />
      <Container98 />
    </div>
  );
}

function SectionMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[48px] relative size-full">
        <Section2 />
      </div>
    </div>
  );
}

function Paragraph49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#1741b0] text-[12px] text-center tracking-[1.2px] uppercase whitespace-nowrap">Why Choose Us</p>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[44px] relative shrink-0 w-[1248px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[36px] relative shrink-0 text-[#111827] text-[30px] text-center whitespace-nowrap">Built on Trust. Backed by Science.</p>
      </div>
    </div>
  );
}

function ParagraphMargin9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6b7280] text-[14px] text-center w-[576px]">{`Every product we make undergoes rigorous quality testing before it reaches you — because protection isn't optional.`}</p>
      </div>
    </div>
  );
}

function Container104() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph49 />
        <Heading4 />
        <ParagraphMargin9 />
      </div>
    </div>
  );
}

function Icon75() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p1b228440} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p309e840} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container107() {
  return (
    <div className="bg-[#eff6ff] relative rounded-[14px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon75 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[43px] relative shrink-0 w-[247px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[27px] relative shrink-0 text-[#111827] text-[18px] whitespace-nowrap">Manufacturer Direct</p>
      </div>
    </div>
  );
}

function Paragraph50() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6b7280] text-[14px] w-[247px]">We manufacture everything in-house, eliminating middlemen and quality risks.</p>
      </div>
    </div>
  );
}

function Container106() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[217.25px] items-start left-0 p-[25px] rounded-[16px] top-0 w-[297px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container107 />
      <Heading5 />
      <Paragraph50 />
    </div>
  );
}

function Icon76() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p2ada2820} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p4cb2400} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container109() {
  return (
    <div className="bg-[#f0fdf4] relative rounded-[14px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon76 />
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[43px] relative shrink-0 w-[247px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[27px] relative shrink-0 text-[#111827] text-[18px] whitespace-nowrap">Multi-Certified</p>
      </div>
    </div>
  );
}

function Paragraph51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6b7280] text-[14px] w-[247px]">ISO 13485, CE, FDA, BIS, and NIOSH certifications across our product range.</p>
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[217.25px] items-start left-[317px] p-[25px] rounded-[16px] top-0 w-[297px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container109 />
      <Heading6 />
      <Paragraph51 />
    </div>
  );
}

function Icon77() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p12cc5000} id="Vector" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d="M17.5 21H10.5" id="Vector_2" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p34425f00} id="Vector_3" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.pa689e00} id="Vector_4" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p26ea4300} id="Vector_5" stroke="var(--stroke-0, #F54900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container111() {
  return (
    <div className="bg-[#fff7ed] relative rounded-[14px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon77 />
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[43px] relative shrink-0 w-[247px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[27px] relative shrink-0 text-[#111827] text-[18px] whitespace-nowrap">Same-Day Dispatch</p>
      </div>
    </div>
  );
}

function Paragraph52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6b7280] text-[14px] w-[247px]">Orders placed before 2 PM ship the same day from our central warehouse.</p>
      </div>
    </div>
  );
}

function Container110() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[217.25px] items-start left-[634px] p-[25px] rounded-[16px] top-0 w-[297px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container111 />
      <Heading7 />
      <Paragraph52 />
    </div>
  );
}

function Icon78() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <path d={svgPaths.p184ba090} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p5d36b00} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p2f1426c0} id="Vector_3" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
          <path d={svgPaths.p25f79f00} id="Vector_4" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container113() {
  return (
    <div className="bg-[#faf5ff] relative rounded-[14px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon78 />
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[43px] relative shrink-0 w-[247px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[27px] relative shrink-0 text-[#111827] text-[18px] whitespace-nowrap">Dedicated B2B Support</p>
      </div>
    </div>
  );
}

function Paragraph53() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6b7280] text-[14px] w-[247px]">Dedicated account managers for retailers with bulk order facilitation.</p>
      </div>
    </div>
  );
}

function Container112() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[217.25px] items-start left-[951px] p-[25px] rounded-[16px] top-0 w-[297px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container113 />
      <Heading8 />
      <Paragraph53 />
    </div>
  );
}

function Container105() {
  return (
    <div className="h-[217.25px] relative shrink-0 w-full" data-name="Container">
      <Container106 />
      <Container108 />
      <Container110 />
      <Container112 />
    </div>
  );
}

function ContainerMargin14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[32px] relative size-full">
        <Container105 />
      </div>
    </div>
  );
}

function Section3() {
  return (
    <div className="relative shrink-0 w-[1248px]" data-name="Section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[48px] relative size-full">
        <Container104 />
        <ContainerMargin14 />
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="relative shrink-0" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[#111827] text-[20px] whitespace-nowrap">What Our Customers Say</p>
      </div>
    </div>
  );
}

function SectionHeader2() {
  return (
    <div className="relative shrink-0 w-full" data-name="SectionHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Heading9 />
      </div>
    </div>
  );
}

function Icon79() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon80() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon81() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon82() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon83() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container116() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[2px] items-start relative size-full">
        <Icon79 />
        <Icon80 />
        <Icon81 />
        <Icon82 />
        <Icon83 />
      </div>
    </div>
  );
}

function Paragraph54() {
  return (
    <div className="relative shrink-0 w-[352.656px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#111827] text-[14px] w-[353px]">{`"CareKart has been our sole supplier for 3 years. The nitrile gloves consistently pass our internal AQL audits. Delivery is always on time."`}</p>
      </div>
    </div>
  );
}

function Container118() {
  return (
    <div className="bg-[#1741b0] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">PS</p>
      </div>
    </div>
  );
}

function Paragraph55() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">Dr. Priya Sharma</p>
      </div>
    </div>
  );
}

function Paragraph56() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Chief Medical Officer, Fortis Hospital</p>
      </div>
    </div>
  );
}

function Container119() {
  return (
    <div className="relative shrink-0 w-[207.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph55 />
        <Paragraph56 />
      </div>
    </div>
  );
}

function Icon84() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_8_1148)" id="Icon">
          <path d={svgPaths.p22e960f0} id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3e012060} id="Vector_2" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1148">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconAlign() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Icon:align">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Icon84 />
      </div>
    </div>
  );
}

function Container117() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pt-[13px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[rgba(0,0,0,0.09)] border-solid border-t inset-0 pointer-events-none" />
      <Container118 />
      <Container119 />
      <IconAlign />
    </div>
  );
}

function ContainerMargin16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[16px] relative size-full">
        <Container117 />
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[215.25px] items-start left-0 p-[25px] rounded-[16px] top-0 w-[402.656px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container116 />
      <Paragraph54 />
      <ContainerMargin16 />
    </div>
  );
}

function Icon85() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon86() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon87() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon88() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon89() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container121() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[2px] items-start relative size-full">
        <Icon85 />
        <Icon86 />
        <Icon87 />
        <Icon88 />
        <Icon89 />
      </div>
    </div>
  );
}

function Paragraph57() {
  return (
    <div className="relative shrink-0 w-[352.672px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#111827] text-[14px] w-[353px]">{`"Switched from our previous supplier after a quality incident. CareKart's EN388-certified cut-resistant gloves have zero complaints from our floor workers."`}</p>
      </div>
    </div>
  );
}

function Container123() {
  return (
    <div className="bg-[#1741b0] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">RG</p>
      </div>
    </div>
  );
}

function Paragraph58() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">Ramesh Gupta</p>
      </div>
    </div>
  );
}

function Paragraph59() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Procurement Head, Mahindra Manufacturing</p>
      </div>
    </div>
  );
}

function Container124() {
  return (
    <div className="relative shrink-0 w-[249.828px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph58 />
        <Paragraph59 />
      </div>
    </div>
  );
}

function Icon90() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_8_1148)" id="Icon">
          <path d={svgPaths.p22e960f0} id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3e012060} id="Vector_2" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1148">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconAlign1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Icon:align">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Icon90 />
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pt-[13px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[rgba(0,0,0,0.09)] border-solid border-t inset-0 pointer-events-none" />
      <Container123 />
      <Container124 />
      <IconAlign1 />
    </div>
  );
}

function ContainerMargin17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[16px] relative size-full">
        <Container122 />
      </div>
    </div>
  );
}

function Container120() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[215.25px] items-start left-[422.66px] p-[25px] rounded-[16px] top-0 w-[402.672px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container121 />
      <Paragraph57 />
      <ContainerMargin17 />
    </div>
  );
}

function Icon91() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon92() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon93() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon94() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon95() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17f48400} id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container126() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[2px] items-start relative size-full">
        <Icon91 />
        <Icon92 />
        <Icon93 />
        <Icon94 />
        <Icon95 />
      </div>
    </div>
  );
}

function Paragraph60() {
  return (
    <div className="relative shrink-0 w-[352.656px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#111827] text-[14px] w-[353px]">{`"Very competitive pricing on bulk orders. The B2B portal makes reordering effortless. Would appreciate more size options for sterile gloves."`}</p>
      </div>
    </div>
  );
}

function Container128() {
  return (
    <div className="bg-[#1741b0] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">AM</p>
      </div>
    </div>
  );
}

function Paragraph61() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#111827] text-[14px] whitespace-nowrap">Anjali Mehta</p>
      </div>
    </div>
  );
}

function Paragraph62() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6b7280] text-[12px] whitespace-nowrap">Lab Manager, Cipla Pharmaceuticals</p>
      </div>
    </div>
  );
}

function Container129() {
  return (
    <div className="relative shrink-0 w-[204.813px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph61 />
        <Paragraph62 />
      </div>
    </div>
  );
}

function Icon96() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_8_1148)" id="Icon">
          <path d={svgPaths.p22e960f0} id="Vector" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3e012060} id="Vector_2" stroke="var(--stroke-0, #00C950)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1148">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconAlign2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Icon:align">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Icon96 />
      </div>
    </div>
  );
}

function Container127() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pt-[13px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[rgba(0,0,0,0.09)] border-solid border-t inset-0 pointer-events-none" />
      <Container128 />
      <Container129 />
      <IconAlign2 />
    </div>
  );
}

function ContainerMargin18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[16px] relative size-full">
        <Container127 />
      </div>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[215.25px] items-start left-[845.33px] p-[25px] rounded-[16px] top-0 w-[402.656px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0.09)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container126 />
      <Paragraph60 />
      <ContainerMargin18 />
    </div>
  );
}

function Container114() {
  return (
    <div className="h-[215.25px] relative shrink-0 w-full" data-name="Container">
      <Container115 />
      <Container120 />
      <Container125 />
    </div>
  );
}

function ContainerMargin15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <Container114 />
      </div>
    </div>
  );
}

function Section4() {
  return (
    <div className="relative shrink-0 w-[1248px]" data-name="Section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[48px] relative size-full">
        <SectionHeader2 />
        <ContainerMargin15 />
      </div>
    </div>
  );
}

function Container131() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[16px] left-0 text-[#fdc700] text-[12px] top-[4px] tracking-[1.2px] uppercase whitespace-nowrap">{`For Retailers & Wholesalers`}</p>
      </div>
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[80px] relative shrink-0 w-[794.688px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <div className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[0] relative shrink-0 text-[30px] text-white whitespace-nowrap">
          <p className="leading-[36px] mb-0">Scale Your Business with</p>
          <p className="leading-[36px]">CareKart B2B</p>
        </div>
      </div>
    </div>
  );
}

function ParagraphMargin10() {
  return (
    <div className="relative shrink-0" data-name="Paragraph:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#99a1af] text-[16px] w-[512px]">Tiered pricing, dedicated account managers, flexible MOQs, custom labelling, and net-30 credit terms for verified retailers. Join 1,200+ active B2B partners.</p>
      </div>
    </div>
  );
}

function Button47() {
  return (
    <div className="bg-[#fdc700] h-full relative rounded-[14px] shrink-0" data-name="Button">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#733e0a] text-[16px] text-center whitespace-nowrap">Register as Retailer</p>
        </div>
      </div>
    </div>
  );
}

function Button48() {
  return (
    <div className="h-full relative rounded-[14px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[25px] py-[13px] relative size-full">
          <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">View B2B Pricing</p>
        </div>
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="h-[74px] relative shrink-0 w-[794.688px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start pt-[24px] relative size-full">
        <Button47 />
        <Button48 />
      </div>
    </div>
  );
}

function Container130() {
  return (
    <div className="flex-[794.688_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container131 />
        <Heading10 />
        <ParagraphMargin10 />
        <Container132 />
      </div>
    </div>
  );
}

function Paragraph63() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] relative shrink-0 text-[24px] text-center text-white whitespace-nowrap">1,200+</p>
      </div>
    </div>
  );
}

function Paragraph64() {
  return (
    <div className="h-[20px] relative shrink-0 w-[120.656px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[4px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] text-center whitespace-nowrap">Active Partners</p>
      </div>
    </div>
  );
}

function Container134() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col h-[86px] items-start left-0 p-[17px] rounded-[14px] top-0 w-[154.656px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Paragraph63 />
      <Paragraph64 />
    </div>
  );
}

function Paragraph65() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] relative shrink-0 text-[24px] text-center text-white whitespace-nowrap">30%</p>
      </div>
    </div>
  );
}

function Paragraph66() {
  return (
    <div className="h-[20px] relative shrink-0 w-[120.656px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[4px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] text-center whitespace-nowrap">Max Discount</p>
      </div>
    </div>
  );
}

function Container135() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col h-[86px] items-start left-[170.66px] p-[17px] rounded-[14px] top-0 w-[154.656px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Paragraph65 />
      <Paragraph66 />
    </div>
  );
}

function Paragraph67() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] relative shrink-0 text-[24px] text-center text-white whitespace-nowrap">₹50L+</p>
      </div>
    </div>
  );
}

function Paragraph68() {
  return (
    <div className="h-[20px] relative shrink-0 w-[120.656px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[4px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] text-center whitespace-nowrap">Avg. Annual B2B GMV</p>
      </div>
    </div>
  );
}

function Container136() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col h-[86px] items-start left-0 p-[17px] rounded-[14px] top-[102px] w-[154.656px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Paragraph67 />
      <Paragraph68 />
    </div>
  );
}

function Paragraph69() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[32px] relative shrink-0 text-[24px] text-center text-white whitespace-nowrap">48hr</p>
      </div>
    </div>
  );
}

function Paragraph70() {
  return (
    <div className="h-[20px] relative shrink-0 w-[120.656px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pt-[4px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] text-center whitespace-nowrap">Credit Approval</p>
      </div>
    </div>
  );
}

function Container137() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col h-[86px] items-start left-[170.66px] p-[17px] rounded-[14px] top-[102px] w-[154.656px]" data-name="Container">
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Paragraph69 />
      <Paragraph70 />
    </div>
  );
}

function Container133() {
  return (
    <div className="h-[188px] relative shrink-0 w-[325.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container134 />
        <Container135 />
        <Container136 />
        <Container137 />
      </div>
    </div>
  );
}

function Section5() {
  return (
    <div className="h-[358px] relative rounded-[16px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(163.994deg, rgb(17, 24, 39) 0%, rgb(30, 41, 59) 100%)" }} data-name="Section">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[32px] items-center p-[48px] relative size-full">
          <Container130 />
          <Container133 />
        </div>
      </div>
    </div>
  );
}

function SectionMargin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[48px] relative size-full">
        <Section5 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[1280px] px-[16px] py-[32px] relative shrink-0 w-[1280px]" data-name="Container">
      <Section />
      <Section1 />
      <SectionMargin />
      <Section3 />
      <Section4 />
      <SectionMargin1 />
    </div>
  );
}

function ContainerMargin3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container49 />
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Content">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container9 />
        <Container22 />
        <ContainerMargin3 />
      </div>
    </div>
  );
}

function Icon97() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3f3d8e00} id="Vector" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M9 12L11 14L15 10" id="Vector_2" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container141() {
  return (
    <div className="h-[26px] relative shrink-0 w-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Icon97 />
      </div>
    </div>
  );
}

function Paragraph71() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">ISO 13485 Certified</p>
      </div>
    </div>
  );
}

function Paragraph72() {
  return (
    <div className="h-[18px] relative shrink-0 w-[204.734px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Medical device quality management</p>
      </div>
    </div>
  );
}

function Container142() {
  return (
    <div className="relative shrink-0 w-[204.734px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph71 />
        <Paragraph72 />
      </div>
    </div>
  );
}

function Container140() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-[16px] top-[24px] w-[294px]" data-name="Container">
      <Container141 />
      <Container142 />
    </div>
  );
}

function Icon98() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67fd620} id="Vector" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M15 18H9" id="Vector_2" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2beec100} id="Vector_3" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13934880} id="Vector_4" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p1ff3c700} id="Vector_5" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container144() {
  return (
    <div className="h-[26px] relative shrink-0 w-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Icon98 />
      </div>
    </div>
  );
}

function Paragraph73() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">Pan-India Shipping</p>
      </div>
    </div>
  );
}

function Paragraph74() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Same-day dispatch for orders before 2 PM</p>
      </div>
    </div>
  );
}

function Container145() {
  return (
    <div className="relative shrink-0 w-[240px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph73 />
        <Paragraph74 />
      </div>
    </div>
  );
}

function Container143() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-[334px] top-[24px] w-[294px]" data-name="Container">
      <Container144 />
      <Container145 />
    </div>
  );
}

function Icon99() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p223b2500} id="Vector" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M21 3V8H16" id="Vector_2" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p1f4a200} id="Vector_3" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M8 16H3V21" id="Vector_4" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container147() {
  return (
    <div className="h-[26px] relative shrink-0 w-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Icon99 />
      </div>
    </div>
  );
}

function Paragraph75() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">Easy Returns</p>
      </div>
    </div>
  );
}

function Paragraph76() {
  return (
    <div className="h-[18px] relative shrink-0 w-[185.156px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">30-day hassle-free return policy</p>
      </div>
    </div>
  );
}

function Container148() {
  return (
    <div className="relative shrink-0 w-[185.156px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph75 />
        <Paragraph76 />
      </div>
    </div>
  );
}

function Container146() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-[652px] top-[24px] w-[294px]" data-name="Container">
      <Container147 />
      <Container148 />
    </div>
  );
}

function Icon100() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p2dfab7c0} id="Vector" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c300c0} id="Vector_2" stroke="var(--stroke-0, #1741B0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container150() {
  return (
    <div className="h-[26px] relative shrink-0 w-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <Icon100 />
      </div>
    </div>
  );
}

function Paragraph77() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">Secure Payments</p>
      </div>
    </div>
  );
}

function Paragraph78() {
  return (
    <div className="h-[18px] relative shrink-0 w-[186.578px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">256-bit SSL encrypted checkout</p>
      </div>
    </div>
  );
}

function Container151() {
  return (
    <div className="relative shrink-0 w-[186.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph77 />
        <Paragraph78 />
      </div>
    </div>
  );
}

function Container149() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-[970px] top-[24px] w-[294px]" data-name="Container">
      <Container150 />
      <Container151 />
    </div>
  );
}

function Container139() {
  return (
    <div className="h-[86px] max-w-[1280px] relative shrink-0 w-[1280px]" data-name="Container">
      <Container140 />
      <Container143 />
      <Container146 />
      <Container149 />
    </div>
  );
}

function ContainerMargin19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container139 />
      </div>
    </div>
  );
}

function Container138() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#364153] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px relative size-full">
        <ContainerMargin19 />
      </div>
    </div>
  );
}

function Icon101() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3840bd70} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6.75 9L8.25 10.5L11.25 7.5" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container155() {
  return (
    <div className="bg-[#1741b0] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon101 />
      </div>
    </div>
  );
}

function Container156() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold leading-[0] relative shrink-0 text-[18px] text-white whitespace-nowrap">
          <span className="leading-[28px]">Care</span>
          <span className="leading-[28px] text-[#0d9488]">Kart</span>
        </p>
      </div>
    </div>
  );
}

function Container154() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container155 />
        <Container156 />
      </div>
    </div>
  );
}

function Paragraph79() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[#99a1af] text-[12px] w-[288px]">{`India's trusted manufacturer of medical-grade and industrial protection products. Certified, dependable, delivered.`}</p>
      </div>
    </div>
  );
}

function Text30() {
  return (
    <div className="h-full relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#4a5565] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[3px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#99a1af] text-[10px] whitespace-nowrap">ISO 13485</p>
      </div>
    </div>
  );
}

function Text31() {
  return (
    <div className="h-full relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#4a5565] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[3px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#99a1af] text-[10px] whitespace-nowrap">CE</p>
      </div>
    </div>
  );
}

function Text32() {
  return (
    <div className="h-full relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#4a5565] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[3px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#99a1af] text-[10px] whitespace-nowrap">FDA</p>
      </div>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-full relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#4a5565] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[3px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#99a1af] text-[10px] whitespace-nowrap">BIS</p>
      </div>
    </div>
  );
}

function Text34() {
  return (
    <div className="h-full relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#4a5565] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[3px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#99a1af] text-[10px] whitespace-nowrap">WHO</p>
      </div>
    </div>
  );
}

function Container157() {
  return (
    <div className="h-[37px] relative shrink-0 w-[288px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start pt-[16px] relative size-full">
        <Text30 />
        <Text31 />
        <Text32 />
        <Text33 />
        <Text34 />
      </div>
    </div>
  );
}

function Container153() {
  return (
    <div className="absolute content-stretch flex flex-col h-[246px] items-start left-[16px] top-[40px] w-[288px]" data-name="Container">
      <Container154 />
      <Paragraph79 />
      <Container157 />
    </div>
  );
}

function Paragraph80() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">Products</p>
      </div>
    </div>
  );
}

function Button49() {
  return (
    <div className="h-[28px] relative shrink-0 w-[88px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Medical Gloves</p>
      </div>
    </div>
  );
}

function Button50() {
  return (
    <div className="h-[24px] relative shrink-0 w-[89px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Surgical Gloves</p>
      </div>
    </div>
  );
}

function Button51() {
  return (
    <div className="h-[24px] relative shrink-0 w-[96px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Industrial Gloves</p>
      </div>
    </div>
  );
}

function Button52() {
  return (
    <div className="h-[24px] relative shrink-0 w-[67px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Face Masks</p>
      </div>
    </div>
  );
}

function Button53() {
  return (
    <div className="h-[24px] relative shrink-0 w-[47px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">PPE Kits</p>
      </div>
    </div>
  );
}

function Button54() {
  return (
    <div className="h-[32px] relative shrink-0 w-[56px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center py-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Sanitizers</p>
      </div>
    </div>
  );
}

function Container158() {
  return (
    <div className="absolute content-stretch flex flex-col h-[246px] items-start left-[336px] top-[40px] w-[288px]" data-name="Container">
      <Paragraph80 />
      <Button49 />
      <Button50 />
      <Button51 />
      <Button52 />
      <Button53 />
      <Button54 />
    </div>
  );
}

function Paragraph81() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">Company</p>
      </div>
    </div>
  );
}

function Button55() {
  return (
    <div className="h-[28px] relative shrink-0 w-[53px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">About Us</p>
      </div>
    </div>
  );
}

function Button56() {
  return (
    <div className="h-[24px] relative shrink-0 w-[84px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Manufacturing</p>
      </div>
    </div>
  );
}

function Button57() {
  return (
    <div className="h-[24px] relative shrink-0 w-[79px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Certifications</p>
      </div>
    </div>
  );
}

function Button58() {
  return (
    <div className="h-[24px] relative shrink-0 w-[46px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Careers</p>
      </div>
    </div>
  );
}

function Button59() {
  return (
    <div className="h-[24px] relative shrink-0 w-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Press</p>
      </div>
    </div>
  );
}

function Button60() {
  return (
    <div className="h-[32px] relative shrink-0 w-[48px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center py-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Contact</p>
      </div>
    </div>
  );
}

function Container159() {
  return (
    <div className="absolute content-stretch flex flex-col h-[246px] items-start left-[656px] top-[40px] w-[288px]" data-name="Container">
      <Paragraph81 />
      <Button55 />
      <Button56 />
      <Button57 />
      <Button58 />
      <Button59 />
      <Button60 />
    </div>
  );
}

function Paragraph82() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">Support</p>
      </div>
    </div>
  );
}

function Button61() {
  return (
    <div className="h-[28px] relative shrink-0 w-[60px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[12px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">B2B Portal</p>
      </div>
    </div>
  );
}

function Button62() {
  return (
    <div className="h-[24px] relative shrink-0 w-[109px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Register as Retailer</p>
      </div>
    </div>
  );
}

function Button63() {
  return (
    <div className="h-[24px] relative shrink-0 w-[69px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Help Center</p>
      </div>
    </div>
  );
}

function Button64() {
  return (
    <div className="h-[24px] relative shrink-0 w-[89px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Shipping Policy</p>
      </div>
    </div>
  );
}

function Button65() {
  return (
    <div className="h-[24px] relative shrink-0 w-[75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Return Policy</p>
      </div>
    </div>
  );
}

function Button66() {
  return (
    <div className="h-[24px] relative shrink-0 w-[79px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Privacy Policy</p>
      </div>
    </div>
  );
}

function Button67() {
  return (
    <div className="h-[24px] relative shrink-0 w-[94px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[8px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">Terms of Service</p>
      </div>
    </div>
  );
}

function Icon102() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_8_1055)" id="Icon">
          <path d={svgPaths.p2c04e800} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1055">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container162() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Icon102 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">1800-XXX-XXXX (Toll Free)</p>
      </div>
    </div>
  );
}

function Icon103() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p5c184f0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2a640080} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container163() {
  return (
    <div className="h-[22px] relative shrink-0 w-[288px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pt-[6px] relative size-full">
        <Icon103 />
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] whitespace-nowrap">support@carekart.in</p>
      </div>
    </div>
  );
}

function Container161() {
  return (
    <div className="h-[54px] relative shrink-0 w-[288px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] relative size-full">
        <Container162 />
        <Container163 />
      </div>
    </div>
  );
}

function Container160() {
  return (
    <div className="absolute content-stretch flex flex-col h-[246px] items-start left-[976px] top-[40px] w-[288px]" data-name="Container">
      <Paragraph82 />
      <Button61 />
      <Button62 />
      <Button63 />
      <Button64 />
      <Button65 />
      <Button66 />
      <Button67 />
      <Container161 />
    </div>
  );
}

function Container152() {
  return (
    <div className="h-[326px] max-w-[1280px] relative shrink-0 w-[1280px]" data-name="Container">
      <Container153 />
      <Container158 />
      <Container159 />
      <Container160 />
    </div>
  );
}

function ContainerMargin20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container152 />
      </div>
    </div>
  );
}

function Paragraph83() {
  return (
    <div className="relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] whitespace-nowrap">© 2025 CareKart. All rights reserved. GSTIN: 27AAPFC1234M1Z5</p>
      </div>
    </div>
  );
}

function Text35() {
  return (
    <div className="bg-[#1e2939] relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[5px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[13.5px] relative shrink-0 text-[#6a7282] text-[9px] whitespace-nowrap">VISA</p>
      </div>
    </div>
  );
}

function Text36() {
  return (
    <div className="bg-[#1e2939] relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[5px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[13.5px] relative shrink-0 text-[#6a7282] text-[9px] whitespace-nowrap">MC</p>
      </div>
    </div>
  );
}

function Text37() {
  return (
    <div className="bg-[#1e2939] relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[5px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[13.5px] relative shrink-0 text-[#6a7282] text-[9px] whitespace-nowrap">UPI</p>
      </div>
    </div>
  );
}

function Text38() {
  return (
    <div className="bg-[#1e2939] relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[5px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[13.5px] relative shrink-0 text-[#6a7282] text-[9px] whitespace-nowrap">RZP</p>
      </div>
    </div>
  );
}

function Text39() {
  return (
    <div className="bg-[#1e2939] relative rounded-[4px] shrink-0" data-name="Text">
      <div aria-hidden className="absolute border border-[#364153] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[5px] relative size-full">
        <p className="[word-break:break-word] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold leading-[13.5px] relative shrink-0 text-[#6a7282] text-[9px] whitespace-nowrap">COD</p>
      </div>
    </div>
  );
}

function Container166() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text35 />
        <Text36 />
        <Text37 />
        <Text38 />
        <Text39 />
      </div>
    </div>
  );
}

function Container165() {
  return (
    <div className="content-stretch flex items-center justify-between max-w-[1280px] p-[16px] relative shrink-0 w-[1280px]" data-name="Container">
      <Paragraph83 />
      <Container166 />
    </div>
  );
}

function ContainerMargin21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Container165 />
      </div>
    </div>
  );
}

function Container164() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#1e2939] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-px relative size-full">
        <ContainerMargin21 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#101828] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Footer">
      <Container138 />
      <ContainerMargin20 />
      <Container164 />
    </div>
  );
}

function FooterMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[64px] relative size-full">
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-white min-h-[944px] relative shrink-0 w-full" data-name="App">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-h-[inherit] relative size-full">
        <Header />
        <MainContent />
        <FooterMargin />
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="h-[944px] relative shrink-0 w-[1549px]" data-name="Body">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <App />
      </div>
    </div>
  );
}

export default function Document() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Document">
      <Body />
    </div>
  );
}