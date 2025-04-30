import React from "react";
import { Header } from "../components/Header";
import "../App.css"

function Home() {
    return (
        <div>
            <Header></Header>
            <h1 style={{
                textAlign: "center"
            }}>
                Welcome to your Application Tracker!
            </h1>
        </div>
    )
}

export default Home;