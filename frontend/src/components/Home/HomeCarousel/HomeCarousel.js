import React, { useState, useEffect } from "react";
import "./styles/HomeCarousel.css";
import Carousel from "react-material-ui-carousel";
import {
  Paper,
  Button,
  Grid,
  Typography,
  ThemeProvider,
} from "@material-ui/core";
import { MaximumYellowRed, PrussianBlue } from "../../Misc/Colors/Colors";
import { Link } from "react-router-dom";
import { titleTheme } from "../Home";

function HomeCarousel({ banner }) {
  return (
    <Carousel className="homeCarousel" animation="slide">
      {banner?.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

function Item({ item }) {
  const [link, setLink] = useState("");

  useEffect(() => {
    if (item.product_id) {
      setLink(`/product/${item.product_id}`);
    }

    if (item.category_id) {
      setLink(`/search?category=${item.category.category_name}`);
    }
  }, [item]);

  return (
    <Grid className="homeCarousel__item" container component={Paper}>
      <Grid className="homeCarousel__item__image" item xs={12}>
        <img src={item.image_url} alt="" />
        <Grid
          className="homeCarousel__item__image__overlay"
          container
          direction="column"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Grid item>
            <ThemeProvider theme={titleTheme}>
              <Typography component="h2" variant="h4">
                {item.banner_title}
              </Typography>
            </ThemeProvider>
          </Grid>
          <Grid
            item
            className="homeCarousel__item__image__overlay__description"
          >
            <Typography>{item.banner_description}</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              style={{ color: "white", border: "1px solid white" }}
            >
              <a
                style={{ textDecoration: "none", color: "#FFF" }}
                rel="noreferrer"
                target="_blank"
                href={link}
              >
                Check it out!
              </a>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HomeCarousel;
