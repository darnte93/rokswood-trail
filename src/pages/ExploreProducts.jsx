import { useEffect, useState } from "react";
import ProductCard from "../component/explore/ProductCard";
import fetchFromApi from "../utils/fetchFromApi";
import SelectCategory from "../component/explore/SelectCategory";
import PriceFilter from "../component/explore/PriceFilter";
import "./ExploreProducts.css";
import { useParams } from "react-router-dom";
import Shimmer from "../component/shimmer/Shimmer";

function ExploreProduct() {
  const [products, setProducts] = useState([]);
  const [priceFlter, setPriceFilter] = useState("default");
  const [checkBoxState, setCheckBoxState] = useState({
    men: false,
    women: false,
    electronics: false,
    jewelery: false
  });
  let { category } = useParams();

  useEffect(() => {
    let resetCheckBoxState = {
      men: false,
      women: false, 
      electronics: false,
      jewelery: false
    };
    if (category === "all") {
      setCheckBoxState(resetCheckBoxState);
      return;
    }
    setCheckBoxState({ ...resetCheckBoxState, [category]: true });
  }, [category]);

  useEffect(() => {
    async function getData() {
      let res = await fetchFromApi("products");
      function getFilteredData() {
        // if both men and women checkbox are not true than load both men's and women's clothing
        // we are filtering this since the default request also provide result for category that we don't want
        if (!checkBoxState.men && !checkBoxState.women && !checkBoxState.electronics && !checkBoxState.jewelery) {
          let filteredData = res.filter((product) => {
            return (
              product.category === "men's clothing" ||
              product.category === "women's clothing" ||
              product.category === "electronics" ||
              product.category === "jewelery" 
            );
          });
          return filteredData;
        }

        let filteredData = res.filter((product) => {
          if (checkBoxState.men && product.category === "men's clothing") {
            return product;
          } else if (
            checkBoxState.women &&
            product.category === "women's clothing"
          ) {
            return product;
          }
          else if (checkBoxState.electronics && product.category === "electronics") {
            return product;
          }
          else if (checkBoxState.jewelery && product.category === "jewelery") {
            return product;
          }
        });
        return filteredData;
      }
      setProducts(getFilteredData());
      setPriceFilter("default");
    }
    getData();
  }, [checkBoxState]);

  function handleCategoryCheckBox(e) {
    let { name, checked } = e.target;
    setCheckBoxState({ ...checkBoxState, [name]: checked });
  }

  function handlePriceFilter(e) {
    let filter = e.target.value;
    if (filter === "low-to-high") {
      let priceFilteredData = products
        .slice()
        .sort((a, b) => a.price - b.price);
      setProducts(priceFilteredData);
    }
    if (filter === "high-to-low") {
      let priceFilteredData = products
        .slice()
        .sort((a, b) => b.price - a.price);
      setProducts(priceFilteredData);
    }
    setPriceFilter(filter);
  }

  return (
    <main className="product-main">
      <PriceFilter
        priceFlter={priceFlter}
        handlePriceFilter={handlePriceFilter}
      />
      <SelectCategory
        checkBoxState={checkBoxState}
        handleCheckBox={handleCategoryCheckBox}
      />
      <div className="products-container">
        <AllProducts products={products} />
      </div>
    </main>
  );
}

function AllProducts({ products }) {
  let productCards = products.length ? (
    products?.map((product) => {
      return <ProductCard product={product} key={product.id} />;
    })
  ) : (
    <Skeleton />
  );

  return productCards;
}

function Skeleton() {
  let a = [];
  for (let i = 0; i < 4; i++) {
    a.push(<Shimmer key={i} />);
  }
  return a;
}

export default ExploreProduct;
