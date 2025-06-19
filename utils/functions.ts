import {format, parseISO} from "date-fns";

export const dateConverter = (givenDate: string) =>{
    if(!givenDate){
        return "--";
    }
    const formattedDate = format(parseISO(givenDate), "dd MMM yyyy");

    return formattedDate;
}