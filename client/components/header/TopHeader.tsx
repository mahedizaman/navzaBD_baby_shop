import { topHelpCenter } from "@/constants/data";
import Container from "../common/Container";
import Link from "next/link";
import SelectCurrency from "./SelectCurrency";
import HeaderSocialLinks from "./HeaderSocialLinks";

const TopHeader = () => {
  return (
    <div className="w-full bg-[#1e1250] text-white/70 border-b border-white/8">
      {/* Main Row */}
      <Container className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 py-1.75 px-4 md:px-5">
        {/* Left: Help Center Links */}
        <div className="flex items-center">
          {topHelpCenter?.map((item, i) => (
            <Link
              href={item?.href}
              key={item?.title}
              className={`
                text-[11.5px] font-medium tracking-wide
                hover:text-white transition-colors duration-200
                px-3 relative
                ${i === 0 ? "pl-0" : ""}
                ${
                  i !== topHelpCenter.length - 1
                    ? "after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[10px] after:w-px after:bg-white/20"
                    : ""
                }
              `}
            >
              {item?.title}
            </Link>
          ))}
        </div>

        {/* Center: Promo Message (desktop only) */}
        <p className="hidden lg:flex items-center gap-2 text-[11px] tracking-widest text-white/45">
          <span className="inline-block w-4 h-px bg-white/20" />
          100% secure delivery guaranteed
          <span className="inline-block w-4 h-px bg-white/20" />
        </p>

        {/* Right: Currency + Divider + Social */}
        <div className="flex items-center gap-4 border-t md:border-t-0 border-white/6 pt-2 md:pt-0 w-full md:w-auto justify-center md:justify-end">
          <SelectCurrency />
          <div className="hidden sm:block h-[14px] w-px bg-white/15" />
          <HeaderSocialLinks />
        </div>
      </Container>

      {/* Mobile bottom strip: promo message */}
      <div className="block md:hidden bg-white/4 border-t border-white/6 text-center py-1.5 text-[10.5px] tracking-widest text-white/40">
        100% secure delivery · trusted courier
      </div>
    </div>
  );
};

export default TopHeader;
