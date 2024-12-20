export interface Route {
  label: string;
  path: string;
  isExternal?: true;
}

export const routes: Record<string, Array<Route>> = {
  Shows: [
    {
      label: "Calendar",
      path: "/shows",
    },
    // {
    //   label: "Performers",
    //   path: "/performers",
    // },
    // {
    //   label: "Teams",
    //   path: "/teams",
    // },
    {
      label: "Videos",
      path: "https://www.youtube.com/@CATChTheater/playlists?view=1&sort=lad&flow=grid",
      isExternal: true,
    },
    {
      label: "FAQs",
      path: "/faqs/shows",
    },
  ],
  Classes: [
    {
      label: "Catch a class",
      path: "/classes",
    },
    {
      label: "Policies",
      path: "/policies/class-policies",
    },
    {
      label: "FAQs",
      path: "/faqs/classes",
    },
    // {
    //   label: "Workstudy Program",
    //   path: "/workstudy",
    // },
  ],
  // "Business Services": [
  //   {
  //     label: "Organizations",
  //     path: "/organizations",
  //   },
  //   {
  //     label: "Individuals",
  //     path: "/uhhh-idk",
  //   },
  // ],
  "Theater Info": [
    {
      label: "Respect",
      path: "/respect",
    },
    // {
    //   label: "Contact Us",
    //   path: "/uhhh-idk",
    // },
    // {
    //   label: "Our philosophy",
    //   path: "/uhhh-idk",
    // },
    // {
    //   label: "Our people",
    //   path: "/uhhh-idk",
    // },
  ],
};

export const routeCategories = Object.keys(routes) as Array<
  keyof typeof routes
>;
