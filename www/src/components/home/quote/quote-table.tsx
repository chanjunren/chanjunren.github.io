import {ArrowTopLeftIcon} from "@radix-ui/react-icons";
import QuoteItem from "@site/src/components/home/quote/quote-item";
import CustomTag from "@site/src/components/ui/custom-tag";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger,} from "@site/src/components/ui/dialog";
import {ScrollArea} from "@site/src/components/ui/scroll-area";
import {Separator} from "@site/src/components/ui/separator";
import {MateriaPromptOutput} from "@site/src/types/quotes";
import React, {FC, Fragment} from "react";

interface IQuoteTable {
  quotes: MateriaPromptOutput[];
}

const QuoteTable: FC<IQuoteTable> = ({quotes}) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button className="group border-b hover:border-b-foreground transition-all cursor-pointer inline-flex">
            <ArrowTopLeftIcon
              className="group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <CustomTag color="rose">PREVIOUS QOTDs</CustomTag>
            {/* <DialogDescription></DialogDescription> */}
          </DialogHeader>
          <ScrollArea>
            <div className="p-4 h-64">
              {quotes.map((quote, idx) => (
                <Fragment key={`quote-table-item-${idx}`}>
                  <QuoteItem quoteInfo={quote.content}/>
                  <Separator className="my-2"/>
                </Fragment>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>{/* <span>hello</span> */}</DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default QuoteTable;
