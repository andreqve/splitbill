// /app/api/ocr/route.js

import { NextResponse } from 'next/server';

/**
 * This API route is specifically for the "Demo Scan" feature.
 * It uses a GET request to fetch a hardcoded list of items,
 * simulating a successful OCR scan.
 */
export async function GET() {
  // Simulate a network delay to feel like a real API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // The original list of items from your file.
  // This data structure is clean and works with the BillContext.
  const mockItems = [
    {
      name: "Nasi Goreng",
      quantity: 1,
      price: 25000
    },
    {
      name: "Es Teh Tawar",
      quantity: 1,
      price: 3000
    },
    {
      name: "Kwetiau",
      quantity: 1,
      price: 30000
    },
    {
      name: "Air Mineral",
      quantity: 1,
      price: 3000
    }
  ];

  // Return the mock items. The `BillSetup.jsx` component will handle this response.
  return NextResponse.json({
    items: mockItems,
  });
}

// By removing the POST handler from this specific file, we make its purpose
// single and clear, which is a best practice and resolves deployment issues.
// If you need a file upload handler in the future, it should be in a separate file,
// for example: /api/upload/route.js