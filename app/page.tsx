import { Suspense } from "react";
import Image from "next/image";
import SearchBox from "./components/search/SearchBox"
import Category from "./components/category/Category";
import Section1 from "./components/section/section1/Section1";


export default function Home() {
  return (
    <>
      <SearchBox></SearchBox>
      <Category></Category>
      <Section1></Section1>
    </>
  );
}
