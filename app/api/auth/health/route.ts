import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== ヘルスチェック開始 ===');
    
    const healthResponse = await fetch(
      'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/health',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    console.log('ヘルスチェックレスポンス詳細:', {
      status: healthResponse.status,
      statusText: healthResponse.statusText,
      ok: healthResponse.ok,
      headers: Object.fromEntries(healthResponse.headers.entries())
    });

    if (!healthResponse.ok) {
      const errorText = await healthResponse.text();
      console.error('ヘルスチェックエラー:', {
        status: healthResponse.status,
        statusText: healthResponse.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { 
          error: `Health check failed: ${healthResponse.status} ${healthResponse.statusText}`,
          details: errorText,
          backendStatus: healthResponse.status
        },
        { status: healthResponse.status }
      );
    }

    const data = await healthResponse.json();
    console.log('ヘルスチェック成功:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('ヘルスチェックでエラー:', error);
    
    return NextResponse.json(
      { 
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        backendStatus: 0
      },
      { status: 500 }
    );
  }
}
