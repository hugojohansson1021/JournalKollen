import { Metadata, MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    

    const response = await fetch("https://www.journalkollen.se/");
    

    return[
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
            lastModified: new Date(),

        },
       


    ]

}