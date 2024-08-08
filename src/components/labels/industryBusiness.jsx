import React, { useEffect, useState } from "react";
import axios from "axios";

const IndustryBusiness = ({ code, category }) => {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.gadduck.info/towns/industry/business-period?code=${code}&quarter=20241`
        );
        
        const result = (response.data.data.businessPeriod / 12).toFixed(1);
        setData(result);
        console.log(result);
        
      } catch (error) {
        console.error("Failed to fetch area data", error);
      }
    };

    fetchData();
  }, [code, category]); // code 또는 category가 변경될 때마다 fetchData 실행

  return (
    <div style={{ margin: "40px" }}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <h4>평균 영업기간:  {data} 년</h4>
        </div>
    </div>
  );
};

export default IndustryBusiness;
