import Link from "next/link";
import type { NextPage } from "next";
import {
  BookOpenIcon,
  PencilIcon,
  TrophyIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex flex-col items-center flex-grow pt-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center flex-grow pt-24 pb-16 px-6 text-center max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
            <span className="block bg-clip-text text-base-100">Build & Take Exams</span>
            <span className="block mt-3 text-2xl sm:text-3xl font-semibold text-base-content/80">Earn NFTs & Crypto</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-12 text-base-content/90 leading-relaxed">
            <span className="block mb-2"><strong className="text-lightGrey">Creators</strong>: Launch exams. Earn crypto with every submission.</span>
            <span className="block"><strong className="text-lightGrey">Takers</strong>: Prove your skills. Own verifiable NFT certificates.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-6">
            <Link href="/organize_exams" passHref>
              <button
                aria-label="Start creating an exam"
                className="bg-primary hover:bg-primary-focus text-white font-semibold py-4 px-12 rounded-full text-lg shadow-lg hover:scale-105 focus:ring-4 focus:ring-primary/30"
              >
                Start Creating Exams
              </button>
            </Link>
            <Link href="/search_exams" passHref>
              <button
                aria-label="Find exams to take"
                className="bg-base-100 hover:bg-base-200 border-2 border-primary text-primary font-semibold py-4 px-12 rounded-full text-lg shadow-md hover:scale-105 focus:ring-4 focus:ring-primary/30"
              >
                Find Exams to Take
              </button>
            </Link>
          </div>
        </div>


        {/* How It Works */}
        <div className="flex-grow bg-ligthGray w-full mt-20 px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-base-200">How It Works</h2>
          </div>
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            {/* Step 1 */}
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg">
              <PencilIcon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Create Exams</h3>
              <p className="text-gray-600">
                Design multiple-choice exams and set a submission fee.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg">
              <MagnifyingGlassIcon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Take Exams</h3>
              <p className="text-gray-600">
                Find exams, pay a small fee, and earn NFT certificates if you pass.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg">
              <TrophyIcon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Earn or Learn</h3>
              <p className="text-gray-600">
                Creators earn fees. Takers earn proof of success.
              </p>
            </div>
          </div>
        </div>

        {/* Why Blockchain */}
        <div className="w-full px-8 py-16 bg-primary text-white">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Why Blockchain?</h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-12">
            <div className="flex flex-col items-center text-center max-w-xs">
              <DocumentCheckIcon className="h-12 w-12 text-white mb-4" />
              <h4 className="text-2xl font-bold mb-2">Verifiable Certificates</h4>
              <p>Proof of success that anyone can verify on-chain.</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <CurrencyDollarIcon className="h-12 w-12 text-white mb-4" />
              <h4 className="text-2xl font-bold mb-2">Transparent Payouts</h4>
              <p>Instant and transparent creator rewards via crypto.</p>
            </div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <ShieldCheckIcon className="h-12 w-12 text-white mb-4" />
              <h4 className="text-2xl font-bold mb-2">Immutable Records</h4>
              <p>Exam results are recorded permanently and securely.</p>
            </div>
          </div>
        </div>
        
        {/* Featured Exams */}
        {false && <div className="flex-grow bg-base-100 w-full px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Featured Exams</h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            {/* Example Exam Cards */}
            <div className="flex flex-col bg-base-300 p-6 rounded-3xl shadow-lg max-w-xs text-center">
              <h3 className="text-xl font-bold mb-2">Blockchain Basics</h3>
              <p className="text-sm text-gray-600 mb-4">Difficulty: Beginner | Fee: 0.01 ETH</p>
              <Link href="/exam/1" passHref>
                <button className="btn btn-primary w-full">Take Exam</button>
              </Link>
            </div>
            <div className="flex flex-col bg-base-300 p-6 rounded-3xl shadow-lg max-w-xs text-center">
              <h3 className="text-xl font-bold mb-2">Smart Contracts 101</h3>
              <p className="text-sm text-gray-600 mb-4">Difficulty: Intermediate | Fee: 0.015 ETH</p>
              <Link href="/exam/2" passHref>
                <button className="btn btn-primary w-full">Take Exam</button>
              </Link>
            </div>
            <div className="flex flex-col bg-base-300 p-6 rounded-3xl shadow-lg max-w-xs text-center">
              <h3 className="text-xl font-bold mb-2">DeFi Fundamentals</h3>
              <p className="text-sm text-gray-600 mb-4">Difficulty: Advanced | Fee: 0.02 ETH</p>
              <Link href="/exam/3" passHref>
                <button className="btn btn-primary w-full">Take Exam</button>
              </Link>
            </div>
          </div>
        </div>}

        {/* Testimonials or Metrics */}
        {false && <div className="w-full px-8 py-12 text-center">
          <h3 className="text-2xl font-bold mb-2">500+ Certificates Issued</h3>
          <p className="text-gray-600">Join a growing community of certified achievers!</p>
        </div>}

        {/* Footer */}
        {false && <footer className="w-full px-8 py-6 bg-base-300 text-center text-sm">
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/">Home</Link>
            <Link href="/organize_exams">Organize Exams</Link>
            <Link href="/search_exams">Search Exams</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
          <div className="mt-4">
            {/* Social Media Icons could be added here */}
            {/* Example: Twitter, Discord, etc. */}
          </div>
        </footer>}
      </div>
    </>
  );
};

export default Home;
