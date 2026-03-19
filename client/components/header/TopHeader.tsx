import { topHelpCenter } from "@/constants/data";
import Container from "../common/Container";
import Link from "next/link";
import SelectCurrency from "./SelectCurrency";
import HeaderSocialLinks from "./HeaderSocialLinks";

const TopHeader = () => {
  return (
    <div className="w-full py-1 text-sm font-medium bg-navzaBDPurple text-muted">
      <Container className="grid grid-cols-1 md:grid-cols-3">
        <div className="flex items-center gap-5 hoverEffect">
          {topHelpCenter?.map((item) => (
            <Link href={item?.href} key={item?.title}>
              <p>{item?.title}</p>
            </Link>
          ))}
        </div>
        <p className="hidden md:inline-flex items-center justify-center">
          100% secure delivary contracting the courier
        </p>
        <div className="hidden md:inline-flex items-center justify-end">
          <SelectCurrency />
          <HeaderSocialLinks />
        </div>
      </Container>
    </div>
  );
};

export default TopHeader;
