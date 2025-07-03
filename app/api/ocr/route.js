import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock OCR result with Indonesian dishes
  const mockItems = [
    {
      id: 1,
      name: "Nasi Goreng",
      quantity: 1,
      price: 25000
    },
    {
      id: 2,
      name: "Es Teh Tawar",
      quantity: 1,
      price: 3000
    },
    {
      id: 3,
      name: "Kwetiau",
      quantity: 1,
      price: 30000
    },
    {
      id: 4,
      name: "Air Mineral",
      quantity: 1,
      price: 3000
    }
  ];

  return NextResponse.json({
    success: true,
    items: mockItems,
    message: "Receipt scanned successfully"
  });
}

export async function POST(request) {
  try {
    // In a real implementation, you would process the uploaded image here
    const formData = await request.formData();
    const file = formData.get('receipt');
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return Indonesian dishes for demonstration
    const mockItems = [
      {
        id: 1,
        name: "Nasi Goreng",
        quantity: 1,
        price: 25000
      },
      {
        id: 2,
        name: "Es Teh Tawar",
        quantity: 1,
        price: 3000
      },
      {
        id: 3,
        name: "Kwetiau",
        quantity: 1,
        price: 30000
      },
      {
        id: 4,
        name: "Air Mineral",
        quantity: 1,
        price: 3000
      }
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