module.exports = {
  siteMetadata: {
    title: `Martin Yankov`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-plugin-manifest`,
            options: {
              maxWidth: 300,
              name: `gatsby-starter-default`,
              short_name: `starter`,
              start_url: `/`,
              background_color: `#663399`,
              theme_color: `#663399`,
              display: `minimal-ui`,
              icon: `src/images/avatar.png`, // This path is relative to the root of the site.
            },
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/src/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Roboto", "Droid Serif", "Abril Fatface", "Poppins"],
        },
      },
    },
  ],
}
