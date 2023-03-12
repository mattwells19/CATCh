import type { Component } from "solid-js";
import { format } from "date-fns";

interface UpcomingShowCardProps {
  date: Date;
  // imgUrl: string;
  title: string;
  description: string;
  ticketsLink: string;
}

const UpcomingShowCard: Component<UpcomingShowCardProps> = (props) => {
  return (
    <a class="block rounded overflow-hidden shadow-xl" href={props.ticketsLink}>
      <p class="bg-violet-500 text-center py-2 text-white text-lg border-b-4 border-pink-300">
        {format(props.date, "E, LLL dd")}
        {` at `}
        {format(props.date, "h:m a")}
      </p>
      <div class="w-full h-36 bg-blue-300 grid place-items-center">
        <p>Img</p>
      </div>
      <div class="p-4">
        <h3 class="text-xl uppercase">{props.title}</h3>
        <p class="mt-3 h-36 text-ellipsis overflow-hidden font-light">
          {props.description}
        </p>
      </div>
      <p class="text-right bg-red-200 bg-opacity-60 p-2 text-red-700 uppercase">
        Get Tickets
      </p>
    </a>
  );
};

export default UpcomingShowCard;
