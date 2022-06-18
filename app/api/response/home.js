import { Images } from "@config";
import * as Utils from "@utils";
import { BaseCollection } from "./collection";

export const getHome = async ({ params }) => {
  await Utils.delay(1000);
  return {
    success: true,
    data: {
      sliders: [
        Images.event1,
        Images.automotive1,
        Images.food1,
        Images.trip1,
        Images.realEstate2,
      ],
      categories: [
        {
          color: "#a569bd",
          description: "",
          featured_image: "10",
          icon: "fas fa-calendar-alt",
          image: {
            full: { url: Images.service4 },
            thump: { url: Images.service4 },
          },
          name: "Events",
          taxonomy: "listar_category",
          term_id: 5,
          term_taxonomy_id: 5,
          url: "http://listar.passionui.com/listar-category/events/",
          count: 10,
        },
        {
          color: "#58d68d",
          description: "",
          featured_image: "9",
          icon: "fas fa-utensils",
          image: {
            full: { url: Images.service7 },
            thump: { url: Images.service7 },
          },
          name: "Restaurant",
          taxonomy: "listar_category",
          term_id: 8,
          term_taxonomy_id: 8,
          url: "http://listar.passionui.com/listar-category/restaurant/",
          count: 10,
        },
        {
          color: "#3c5a99",
          description: "",
          featured_image: "11",
          icon: "fas fa-award",
          image: {
            full: { url: Images.service5 },
            thump: { url: Images.service5 },
          },
          name: "Real Estate",
          taxonomy: "listar_category",
          term_id: 6,
          term_taxonomy_id: 6,
          url: "http://listar.passionui.com/listar-category/real-estate/",
          count: 10,
        },
        {
          color: "#fdc60a",
          description: "",
          featured_image: "8",
          icon: "fas fa-car",
          image: {
            full: { url: Images.service2 },
            thump: { url: Images.service2 },
          },
          name: "Automotive",
          taxonomy: "listar_category",
          term_id: 9,
          term_taxonomy_id: 9,
          url: "http://listar.passionui.com/listar-category/automotive/",
          count: 10,
        },
        {
          color: "#e5634d",
          description: "",
          featured_image: "6",
          icon: "fas fa-shopping-basket",
          image: {
            full: { url: Images.service1 },
            thump: { url: Images.service1 },
          },
          name: "Shopping",
          taxonomy: "listar_category",
          term_id: 2,
          term_taxonomy_id: 2,
          url: "http://listar.passionui.com/listar-category/shopping/",
          count: 10,
        },
        {
          color: "#f25ec0",
          description: "",
          featured_image: "7",
          icon: "far fa-handshake",
          image: {
            full: { url: Images.category3 },
            thump: { url: Images.category3 },
          },
          name: "Business",
          taxonomy: "listar_category",
          term_id: 3,
          term_taxonomy_id: 3,
          url: "http://listar.passionui.com/listar-category/business/",
          count: 10,
        },
        {
          color: "#5d6d7e",
          description: "",
          featured_image: "46",
          icon: "fas fa-edit",
          image: {
            full: { url: Images.location4 },
            thump: { url: Images.location4 },
          },
          name: "Arts",
          taxonomy: "listar_category",
          term_id: 45,
          term_taxonomy_id: 45,
          url: "http://listar.passionui.com/listar-category/arts/",
          count: 10,
        },
        {
          color: "#58d68d",
          description: "",
          featured_image: "28",
          icon: "fas fa-heartbeat",
          image: {
            full: { url: Images.food3 },
            thump: { url: Images.food3 },
          },
          name: "Health",
          taxonomy: "listar_category",
          term_id: 42,
          term_taxonomy_id: 42,
          url: "http://listar.passionui.com/listar-category/health/",
          count: 10,
        },
      ],
      locations: [
        {
          description: "",
          featured_image: "54",
          image: {
            full: { url: Images.place1 },
            thump: { url: Images.place1 },
          },
          name: "Alabama",
          taxonomy: "listar_location",
          term_id: 21,
          term_taxonomy_id: 21,
          url: "http://listar.passionui.com/listar-location/alabama/",
        },
        {
          description: "",
          featured_image: "55",
          image: {
            full: { url: Images.place2 },
            thump: { url: Images.place2 },
          },
          name: "Alaska",
          taxonomy: "listar_location",
          term_id: 22,
          term_taxonomy_id: 22,
          url: "http://listar.passionui.com/listar-location/alaska/",
        },
        {
          description: "",
          featured_image: "56",
          image: {
            full: { url: Images.place3 },
            thump: { url: Images.place3 },
          },
          name: "Arizona",
          taxonomy: "listar_location",
          term_id: 23,
          term_taxonomy_id: 23,
          url: "http://listar.passionui.com/listar-location/arizona/",
        },
        {
          description: "",
          featured_image: "57",
          image: {
            full: { url: Images.place4 },
            thump: { url: Images.place4 },
          },
          name: "Arkansas",
          taxonomy: "listar_location",
          term_id: 27,
          term_taxonomy_id: 27,
          url: "http://listar.passionui.com/listar-location/arkansas/",
        },
        {
          description: "",
          featured_image: "58",
          image: {
            full: { url: Images.place5 },
            thump: { url: Images.place5 },
          },
          name: "California",
          taxonomy: "listar_location",
          term_id: 28,
          term_taxonomy_id: 28,
          url: "http://listar.passionui.com/listar-location/california/",
        },
      ],
      recent_posts: BaseCollection,
    },
  };
};
