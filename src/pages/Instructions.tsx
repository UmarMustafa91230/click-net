import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { DollarSign, Calendar, BarChart, ArrowRightCircle, CheckCircle } from 'lucide-react';

const Instructions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Deposit & Withdraw Instructions</h1>

          {/* Deposit Instructions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">💸 Deposit Instructions</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Login or register your account.</li>
              <li>Go to your dashboard and click on <span className="font-bold">"Deposit"</span>.</li>
              <li>Select a payment method:
                <ul className="list-disc list-inside ml-4">
                  <li>Easypaisa</li>
                  <li>JazzCash</li>
                  <li>Binance</li>
                </ul>
              </li>
              <li>A page will open showing the respective payment number of the admin.</li>
              <li>Send the amount via the selected method.</li>
              <li>Take a <span className="font-bold">screenshot</span> of the payment confirmation.</li>
              <li>Upload the screenshot on the same page.</li>
              <li>Wait for admin approval. Admin will manually review and approve your payment.</li>
              <li>Once approved, your balance will be updated and shown in your dashboard.</li>
              <li>Profit starts calculating daily based on your deposit.</li>
            </ol>
            <p className="mt-4 text-sm text-gray-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-600" /> <span className="font-bold">Note:</span> Your uploaded screenshot goes to admin panel for approval.</p>
          </div>

          {/* Withdraw Instructions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">💵 Withdraw Instructions</h2>
             <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Withdrawals are only allowed after <span className="font-bold">30 days</span> of your first deposit.</li>
              <li>Visit the <span className="font-bold">Withdraw</span> page from the dashboard.</li>
              <li>Fill out the withdrawal form with:
                 <ul className="list-disc list-inside ml-4">
                  <li>Amount</li>
                  <li>Withdrawal method</li>
                  <li>Receiver details (e.g. wallet number)</li>
                </ul>
              </li>
              <li>Submit the request.</li>
              <li>Admin will manually review the request.</li>
              <li>Once approved, you will receive the funds to your provided method.</li>
            </ol>
             <p className="mt-4 text-sm text-gray-600 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-alert-triangle w-4 h-4 mr-1 text-yellow-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg><span className="font-bold">Warning:</span> Withdrawals are <span className="font-bold">manually handled</span> for safety. Make sure your info is correct.</p>
          </div>

          {/* Bonus Info */}
           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
             <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">📌 Bonus Info</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-green-600"/> <span className="font-bold">Monthly Profit</span> = 30% of your deposit</li>
                <li className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-600"/> <span className="font-bold">Daily Profit</span> = Monthly Profit / 30</li>
                <li className="flex items-center"><BarChart className="w-4 h-4 mr-2 text-purple-600"/> <span className="font-bold">Track everything</span> in your Dashboard &gt; Profits &amp; Transactions</li>
              </ul>
           </div>

          {/* Call to Action */}
          <div className="text-center">
             <a href="/dashboard" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
               Go to Dashboard <ArrowRightCircle className="ml-3 w-5 h-5"/>
             </a>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Instructions; 