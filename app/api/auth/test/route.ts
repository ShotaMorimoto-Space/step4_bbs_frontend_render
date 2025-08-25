import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET() {
  console.log('プロキシテストGETリクエスト受信');
  
  return NextResponse.json({
    message: 'プロキシは正常に動作しています',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}

export async function POST(request: NextRequest) {
  console.log('プロキシテストPOSTリクエスト受信開始');
  
  try {
    const body = await request.json();
    console.log('リクエストボディ:', body);
    
    return NextResponse.json({
      message: 'プロキシテストPOST成功',
      receivedData: body,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('プロキシテストエラー:', error);
    
    return NextResponse.json(
      { 
        error: 'Proxy test error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
