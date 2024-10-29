"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo, useAnimation } from "framer-motion";
import {
	Heart,
	Share2,
	Home,
	Search,
	Calculator,
	User,
	Check,
	X,
} from "lucide-react";

interface Car {
	id: number;
	make: string;
	model: string;
	year: number;
	mileage: string;
	engine: string;
	seats: number;
	pricePerMonth: number;
	image: string;
}

const cars: Car[] = [
	{
		id: 1,
		make: "Maruti",
		model: "Creta",
		year: 2024,
		mileage: "19.6 kmpl",
		engine: "1497 cc",
		seats: 5,
		pricePerMonth: 35000,
		image: "/placeholder.svg?height=300&width=400",
	},
	{
		id: 2,
		make: "Honda",
		model: "City",
		year: 2024,
		mileage: "21.4 kmpl",
		engine: "1498 cc",
		seats: 5,
		pricePerMonth: 30000,
		image: "/placeholder.svg?height=300&width=400",
	},
	{
		id: 3,
		make: "Hyundai",
		model: "i20",
		year: 2024,
		mileage: "20.2 kmpl",
		engine: "1197 cc",
		seats: 5,
		pricePerMonth: 25000,
		image: "/placeholder.svg?height=300&width=400",
	},
	{
		id: 4,
		make: "Tata",
		model: "Nexon",
		year: 2024,
		mileage: "17.4 kmpl",
		engine: "1199 cc",
		seats: 5,
		pricePerMonth: 28000,
		image: "/placeholder.svg?height=300&width=400",
	},
	{
		id: 5,
		make: "Mahindra",
		model: "XUV300",
		year: 2024,
		mileage: "17 kmpl",
		engine: "1497 cc",
		seats: 5,
		pricePerMonth: 32000,
		image: "/placeholder.svg?height=300&width=400",
	},
];

export default function Component() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [likedCars, setLikedCars] = useState<number[]>([]);
	const constraintsRef = useRef(null);
	const cardControls = useAnimation();
	const feedbackControls = useAnimation();

	const removeCard = (direction: "left" | "right") => {
		if (direction === "right") {
			setLikedCars((prev) => [...prev, cars[currentIndex].id]);
			setCurrentIndex(
				(prevIndex) => (prevIndex - 1 + cars.length) % cars.length
			);
		} else {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % cars.length);
		}
	};

	const handleDrag = async (info: PanInfo) => {
		const windowWidth = window.innerWidth;
		const threshold = windowWidth * 0.5;
		const swipePercentage = (info.offset.x / threshold) * 100;

		if (Math.abs(info.offset.x) >= threshold) {
			if (info.offset.x > 0) {
				await feedbackControls.start({
					opacity: 1,
					scale: 1.2,
					transition: { duration: 0.2 },
				});
				removeCard("right");
			} else {
				await feedbackControls.start({
					opacity: 1,
					scale: 1.2,
					transition: { duration: 0.2 },
				});
				removeCard("left");
			}
			feedbackControls.start({ opacity: 0, scale: 0 });
		} else {
			cardControls.start({
				x: 0,
				rotate: 0,
				transition: { type: "spring", stiffness: 300, damping: 20 },
			});
			feedbackControls.start({ opacity: 0, scale: 0 });
		}

		if (swipePercentage > 0) {
			feedbackControls.set({ opacity: swipePercentage / 100 });
		} else {
			feedbackControls.set({ opacity: Math.abs(swipePercentage) / 100 });
		}
	};

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			<header className="p-4 bg-white shadow-sm">
				<div className="relative">
					<input
						type="text"
						placeholder="Search your car"
						className="w-full p-2 pl-10 pr-4 border rounded-full"
					/>
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={20}
					/>
				</div>
				<div className="flex gap-2 mt-4 overflow-x-auto pb-2">
					<button className="px-4 py-1 rounded-full bg-gray-200 text-sm whitespace-nowrap">
						All
					</button>
					<button className="px-4 py-1 rounded-full bg-yellow-500 text-white text-sm whitespace-nowrap">
						SUV
					</button>
					<button className="px-4 py-1 rounded-full bg-yellow-500 text-white text-sm whitespace-nowrap">
						10-15 Lakh
					</button>
					<button className="px-4 py-1 rounded-full bg-gray-200 text-sm whitespace-nowrap">
						EV
					</button>
				</div>
			</header>

			<main className="flex-1 overflow-hidden relative" ref={constraintsRef}>
				<div className="absolute inset-x-0 top-0 h-2 bg-gray-200 z-10">
					<div
						className="h-full bg-yellow-500"
						style={{ width: `${((currentIndex + 1) / cars.length) * 100}%` }}
					/>
				</div>
				<div className="absolute top-4 left-4 z-10 bg-white px-2 py-1 rounded-full text-sm font-medium">
					{currentIndex + 1} / {cars.length}
				</div>
				<div className="absolute inset-0 flex items-center justify-center">
					<AnimatePresence>
						{cars.map((car, index) => {
							const isCurrentCard = index === currentIndex;
							const offset = index - currentIndex;
							return (
								<motion.div
									key={car.id}
									className="absolute w-full max-w-sm"
									style={{
										zIndex: cars.length - Math.abs(offset),
									}}
									initial={{ scale: 0.8, y: 0, x: 0 }}
									animate={{
										scale: isCurrentCard ? 1 : 0.9 - Math.abs(offset) * 0.05,
										y: isCurrentCard
											? 0
											: offset > 0
											? -20 * offset
											: 20 * Math.abs(offset),
										x: isCurrentCard ? 0 : offset > 0 ? 10 * offset : 0,
									}}
									exit={{ x: 300, opacity: 0 }}
									transition={{ type: "spring", stiffness: 300, damping: 20 }}
									drag={isCurrentCard ? "x" : false}
									dragConstraints={constraintsRef}
									onDragEnd={(e, info) => isCurrentCard && handleDrag(info)}
								>
									<div className="bg-white rounded-lg shadow-lg overflow-hidden">
										<div className="relative">
											<img
												src={car.image}
												alt={`${car.make} ${car.model}`}
												className="w-full h-48 object-cover"
											/>
											<div className="absolute top-2 left-2 flex gap-2">
												<span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
													SUV
												</span>
												<span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
													Automatic
												</span>
												<span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
													Petrol
												</span>
											</div>
											<button className="absolute top-2 right-2 p-1 bg-white rounded-full">
												<Heart
													className={`w-6 h-6 ${
														likedCars.includes(car.id)
															? "text-red-500 fill-red-500"
															: "text-gray-500"
													}`}
												/>
											</button>
											<button className="absolute bottom-2 right-2 p-1 bg-white rounded-full">
												<Share2 className="w-6 h-6 text-gray-500" />
											</button>
										</div>
										<div className="p-4">
											<h2 className="text-xl font-semibold">{`${car.make} ${car.model}`}</h2>
											<p className="text-gray-600">{`${car.mileage} | ${car.engine} | ${car.seats} seater`}</p>
											<div className="mt-4 flex justify-between items-baseline">
												<div>
													<span className="text-3xl font-bold text-green-600">
														₹{car.pricePerMonth / 1000}k
													</span>
													<span className="text-gray-500 ml-1">per month</span>
												</div>
												<p className="text-green-600">
													Save ₹10 Lakh on road-price
												</p>
											</div>
											<div className="mt-4">
												<h3 className="text-lg font-semibold mb-2">
													Choose your tenure
												</h3>
												<div className="flex gap-2">
													<button className="flex-1 py-2 px-4 border rounded-lg">
														24 months
													</button>
													<button className="flex-1 py-2 px-4 bg-yellow-100 border border-yellow-500 rounded-lg">
														36 months
													</button>
													<button className="flex-1 py-2 px-4 border rounded-lg">
														48 months
													</button>
												</div>
											</div>
											<div className="mt-4 bg-gray-100 p-4 rounded-lg">
												<h3 className="text-lg font-semibold">You pay</h3>
												<p className="text-2xl font-bold">
													₹52,990
													<span className="text-sm font-normal">/month</span>
												</p>
												<div className="mt-2 text-sm text-gray-600">
													<p>On-road price: ₹21,35,000</p>
													<p>Effective price: ₹13,99,000</p>
												</div>
												<p className="mt-2 text-sm text-green-600">
													Enjoy tax benefits up to ₹9,50,000!
												</p>
											</div>
											<button className="w-full mt-4 py-3 bg-yellow-500 text-white rounded-lg font-semibold">
												Book this car
											</button>
										</div>
									</div>
								</motion.div>
							);
						})}
					</AnimatePresence>
					<motion.div
						className="absolute inset-0 flex items-center justify-center pointer-events-none"
						animate={feedbackControls}
						initial={{ opacity: 0, scale: 0 }}
					>
						<Check className="text-green-500 w-24 h-24" />
						<X className="text-red-500 w-24 h-24" />
					</motion.div>
				</div>
			</main>

			<footer className="bg-white border-t">
				<nav className="flex justify-around py-2">
					<button className="flex flex-col items-center text-yellow-500">
						<Home size={24} />
						<span className="text-xs mt-1">Home</span>
					</button>
					<button className="flex flex-col items-center text-gray-400">
						<Search size={24} />
						<span className="text-xs mt-1">Search</span>
					</button>
					<button className="flex flex-col items-center text-gray-400">
						<Calculator size={24} />
						<span className="text-xs mt-1">Calculator</span>
					</button>
					<button className="flex flex-col items-center text-gray-400">
						<User size={24} />
						<span className="text-xs mt-1">Profile</span>
					</button>
				</nav>
			</footer>
		</div>
	);
}
