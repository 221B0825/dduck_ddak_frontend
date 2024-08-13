import React, { useEffect, useState } from "react";
import axios from "axios";

const IndustryBusiness = ({ code }) => {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.gadduck.info/towns/industry/business-period?code=${code}&quarter=20241`
        );

        const result = (response.data.data.businessPeriod / 12).toFixed(1);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch area data", error);
      }
    };

    fetchData();
  }, [code]);

  return (
    <div style={{ margin: "5px" }}>
      <h6>점포 평균 영업기간: {data} 년</h6>
    </div>
  );
};

export default IndustryBusiness;
