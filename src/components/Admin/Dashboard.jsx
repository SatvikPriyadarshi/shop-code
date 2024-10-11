import Layout from "./Layout";
import { FaBasketShopping } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { PiContactlessPayment } from "react-icons/pi";
import { FaUsersLine } from "react-icons/fa6";
import Chart from 'react-apexcharts';

const Dashboard = () => {
    const sales = {
        options: {
            chart: {
                id: 'sales-chart',
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
            },
        },
        series: [{
            name: 'Sales',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        }],
    };

    const profit = {
        series: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            },
            yaxis: {
                title: {
                    text: '$ (thousands)',
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: (val) => `$ ${val} thousands`,
                },
            },
        },
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-orange-600 text-white rounded-lg shadow-lg py-6 px-4 flex items-center">
                    <div className="flex-shrink-0">
                        <div className="flex justify-center items-center bg-orange-400 w-16 h-16 border-2 border-white rounded-full">
                            <IoCartOutline className="text-3xl text-white" />
                        </div>
                    </div>
                    <div className="flex-1 ml-4">
                        <h1 className="text-lg md:text-xl font-semibold">Products</h1>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            {(23323).toLocaleString()}
                        </h1>
                    </div>
                </div>

                <div className="bg-blue-600 text-white rounded-lg shadow-lg py-6 px-4 flex items-center">
                    <div className="flex-shrink-0">
                        <div className="flex justify-center items-center bg-orange-400 w-16 h-16 border-2 border-white rounded-full">
                            <FaBasketShopping className="text-3xl text-white" />
                        </div>
                    </div>
                    <div className="flex-1 ml-4">
                        <h1 className="text-lg md:text-xl font-semibold">Orders</h1>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            {(2333).toLocaleString()}
                        </h1>
                    </div>
                </div>

                <div className="bg-lime-600 text-white rounded-lg shadow-lg py-6 px-4 flex items-center">
                    <div className="flex-shrink-0">
                        <div className="flex justify-center items-center bg-orange-400 w-16 h-16 border-2 border-white rounded-full">
                            <PiContactlessPayment className="text-3xl text-white" />
                        </div>
                    </div>
                    <div className="flex-1 ml-4">
                        <h1 className="text-lg md:text-xl font-semibold">Payments</h1>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            {(2333).toLocaleString()}
                        </h1>
                    </div>
                </div>

                <div className="bg-lime-600 text-white rounded-lg shadow-lg py-6 px-4 flex items-center">
                    <div className="flex-shrink-0">
                        <div className="flex justify-center items-center bg-orange-400 w-16 h-16 border-2 border-white rounded-full">
                            <FaUsersLine className="text-3xl text-white" />
                        </div>
                    </div>
                    <div className="flex-1 ml-4">
                        <h1 className="text-lg md:text-xl font-semibold">Customers</h1>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            {(2333).toLocaleString()}
                        </h1>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 sm:col-span-2 lg:col-span-4">
                    <h1 className="text-xl font-semibold mb-4">Sales</h1>
                    <Chart options={sales.options} series={sales.series} height={250} />
                </div>
                
                <div className="bg-white shadow-lg rounded-lg p-6 sm:col-span-2 lg:col-span-4">
                    <h1 className="text-xl font-semibold mb-4">Profit</h1>
                    <Chart options={profit.options} series={profit.series} height={250} type="bar" />
                </div>

                <div className="p-6 bg-purple-600 rounded-lg shadow-lg col-span-1 lg:col-span-4 flex flex-col sm:flex-row items-center gap-6">
                    <div className="bg-white rounded-full flex-shrink-0">
                        <img src="/images/3davtar.avif" className="w-24 sm:w-32 rounded-full" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Dashboard Report & Analytics</h1>
                        <p className="text-gray-50">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex expedita facere dicta fugit molestiae delectus. Obcaecati.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
