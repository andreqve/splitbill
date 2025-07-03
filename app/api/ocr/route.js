import { NextResponse } from 'next/server';

// This file acts as a fake server endpoint for the "Demo Scan" feature.
// It simulates what a real OCR server would return after processing an image.

export async function GET() {
  // Simulate a network processing delay to make the demo feel more realistic.
  await new Promise(resolve => setTimeout(resolve, 1000));

  // **THE FIX**: This is the original list of items from your file,
  // but with the "id" field removed from each object.
  // This ensures the data structure perfectly matches what the BillContext's
  // ADD_ITEM action is expecting.
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

  // The response now only contains the `items` array.
  // The BillSetup component will receive this and correctly add the items to the bill.
  return NextResponse.json({
    items: mockItems,
  });
}

// NOTE: The POST function from your original file is not used by the "Demo Scan"
// button, which uses a GET request. It can be kept for future use or removed.
// For clarity, I am including it here as it was in your file.
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('receipt');
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockItems = [
      { name: "Nasi Goreng", quantity: 1, price: 25000 },
      { name: "Es Teh Tawar", quantity: 1, price: 3000 },
      { name: "Kwetiau", quantity: 1, price: 30000 },
      { name: "Air Mineral", quantity: 1, price: 3000 }
    ];

    return NextResponse.json({
      success: true,
      items: mockItems,
      message: "Receipt processed successfully"
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process receipt' },
      { status: 500 }
    );
  }
}