import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/context/context";
import { FAQS } from "@/utils/constants";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate();
  const { user } = UrlState();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl)
      navigate(
        user ? `/dashboard?createNew=${longUrl}` : `/auth?createNew=${longUrl}`
      );
  };
  return (
    <div className="flex flex-col w-full items-center mt-16 container">
      <section className="w-full gap-5 flex flex-col sm:flex-row justify-between ">
        <div className="w-full sm:w-3/5">
          <h2 className="w-full my-2 text-4xl sm:text-4xl md:text-5xl lg:text-7xl  text-white font-extrabold ">
            The Only URL Shortener, <br /> You&rsquo;ll Need!
          </h2>
          <h4 className="mr-5 w-full mt-5 font-normal  sm:text-2xl text-white text-left ">
            Use our URL shortener, QR Codes, and landing pages to engage your
            audience and connect them to the right information. Build, edit, and
            track <em>everything</em> inside the Url Sortener Tool from
            <Link to="https://devpedia.in" target="_blank" className="ml-2">
              <em className="text-blue-400">devpedia.in</em>.
            </Link>
          </h4>
        </div>
        <div className="mt-1 sm:mt-11 md:mt-0 lg:mt-0 sm:w-2/5">
          <img src="./hero-img_desktop2.png" alt="" className="rounded-xl" />
        </div>
      </section>

      <section className="w-full flex items-center justify-center mt-24 sm:mt-16 md:mt-24 lg:mt-28">
        <form
          action="submit"
          className="flex flex-col sm:flex-row w-full md:w-2/4 sm:h-14 gap-3"
          onSubmit={handleShorten}
        >
          <Input
            type="url"
            placeholder="Paste Your Loooong Url Here..."
            onChange={(e) => setLongUrl(e.target.value)}
            className="p-7"
          />
          <Button variant="destructive" type="submit" className="px-9 py-7">
            Short
          </Button>
        </form>
      </section>

      <section className="w-full md:px-11">
        <h2 className="my-10 sm:m-16 text-2xl sm:text-3xl md:text-5xl lg:text-7xl text-white text-center font-extrabold">
          All you wish to know, <br /> about this tool.
        </h2>

        <Accordion type="single" collapsible>
          {FAQS.map((faq) => (
            <>
              <AccordionItem value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            </>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default HomePage;
