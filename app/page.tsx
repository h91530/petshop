import { Suspense } from "react";
import SearchBox from "./components/search/SearchBox"
import Category from "./components/category/Category";
import Section1 from "./components/section/section1/Section1";
import Section2 from "./components/section/section2/Section2";


export default function Home() {
  return (
    <>
      <SearchBox></SearchBox>
      <Suspense fallback={null}>
        <Category></Category>
        <Section1></Section1>
      </Suspense>
      <Section2></Section2>
    </>
  );
}
