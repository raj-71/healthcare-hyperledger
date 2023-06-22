import { Link } from "react-router-dom";
import AboutUs from "../components/home/aboutUs";
import ContactUs from "../components/home/contactUs";
import LandingPage from "../components/home/landingPage";
import Services from "../components/home/services";
import Footer from "./footer";

function Home() {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* <header className="bg-white shadow-sm">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex-shrink-0">
                                <a href="#" className="font-bold text-xl text-indigo-500">Healthcare Record Platform</a>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a href="#" className="text-gray-500 hover:text-gray-700 font-medium">Home</a>
                                    <a href="#" className="text-gray-500 hover:text-gray-700 font-medium">Features</a>
                                    <a href="#" className="text-gray-500 hover:text-gray-700 font-medium">About Us</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header> */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <section className="bg-white shadow-lg rounded-lg px-8 pt-12 pb-10 flex flex-col justify-center items-center">
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Secure and Decentralized Healthcare Records</h1>
                            <p className="mt-4 max-w-2xl text-center text-xl text-gray-500">Our platform built on Hyperledger Fabric provides a secure and transparent way for patients and healthcare providers to manage medical records.</p>
                            <div className="mt-10">
                                <Link to="/register" className="inline-block px-6 py-4 text-lg font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Get Started</Link>
                            </div>
                        </section>

                        {/* <section className="mt-12">
                            <h2 className="text-2xl font-extrabold text-gray-900">Features</h2>
                            <ul className="mt-4 max-w-xl text-lg text-gray-500">
                                <li className="mb-2"><span className="inline-block mr-2 h-5 w-5 bg-indigo-500 rounded-full"></span>Secure and private medical record storage</li>
                                <li className="mb-2"><span className="inline-block mr-2 h-5 w-5 bg-indigo-500 rounded-full"></span>Efficient sharing and access of medical records</li>
                                <li className="mb-2"><span className="inline-block mr-2 h-5 w-5 bg-indigo-500 rounded-full"></span>Blockchain-based tamper-proof record keeping</li>
                                <li className="mb-2"><span className="inline-block mr-2 h-5 w-5 bg-indigo-500 rounded-full"></span>Easy patient-controlled management of medical records</li>
                            </ul>
                        </section> */}

                        {/* Features */}
                        <section className="bg-gray-100 py-16">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-3xl font-extrabold text-gray-900">Key Features</h2>
                                </div>
                                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="bg-white shadow-lg rounded-lg px-8 pt-12 pb-10 flex flex-col justify-center items-center">
                                        {/* <img src={"#"} alt="Medical Record" className="h-12 w-12 mb-4" /> */}
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">Medical Record Management</h3>
                                        <p className="text-base text-gray-500 text-center">Our platform provides a seamless and secure way for patients and healthcare providers to manage medical records.</p>
                                    </div>
                                    <div className="bg-white shadow-lg rounded-lg px-8 pt-12 pb-10 flex flex-col justify-center items-center">
                                        {/* <img src={"#"} alt="Secure Data" className="h-12 w-12 mb-4" /> */}
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">Secure Data Storage</h3>
                                        <p className="text-base text-gray-500 text-center">We use Hyperledger Fabric's decentralized architecture to ensure that medical data is stored securely and with integrity.</p>
                                    </div>
                                    <div className="bg-white shadow-lg rounded-lg px-8 pt-12 pb-10 flex flex-col justify-center items-center">
                                        {/* <img src={"#"} alt="Decentralized" className="h-12 w-12 mb-4" /> */}
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">Decentralized Network</h3>
                                        <p className="text-base text-gray-500 text-center">Our platform leverages the power of a decentralized network to enable transparent and efficient healthcare record management.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gray-100 py-16">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-3xl font-extrabold text-gray-900">About Us</h2>
                                </div>
                                <div className="mt-12 bg-white text-center shadow-lg rounded-lg px-8 pt-12 pb-10 flex flex-col justify-center items-center">
                                    <p className="mt-4 max-w-2xl text-xl text-gray-500">We are a team of healthcare professionals and blockchain experts passionate about creating a more secure and efficient healthcare system. Our platform leverages the power of Hyperledger Fabric to provide a secure and transparent way for patients and healthcare providers to manage medical records.</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gray-100 py-16">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-3xl font-extrabold text-gray-900">Get Started</h2>
                                </div>
                                <div className="mt-12 bg-white text-center shadow-lg rounded-lg px-8 pt-12 pb-10 flex flex-col justify-center items-center">
                                    <p className="mt-4 max-w-2xl text-xl text-gray-500">Sign up for our platform today and experience the benefits of secure and decentralized healthcare record management.</p>
                                    <div className="mt-8">
                                        <a href="#" className="inline-block px-6 py-4 text-lg font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Get Started</a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
                <footer className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
                    <div className="border-t border-gray-200 pt-4 flex flex-col justify-center items-center">
                        <p className="text-base leading-6 text-gray-500">
                            © 2023 Healthcare Record Platform. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Home;