import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // バックエンドAPIのベースURL
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
    
    console.log('テスト用API呼び出し:', {
      baseUrl: apiUrl,
      timestamp: new Date().toISOString()
    });
    
    // バックエンドのヘルスチェックエンドポイントを呼び出し
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('バックエンドレスポンス:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('バックエンドエラー:', response.status, errorData);
      return NextResponse.json(
        { 
          error: 'Backend connection failed',
          status: response.status,
          details: errorData
        },
        { status: response.status }
      );
    }

    const healthData = await response.json();
    
    return NextResponse.json({
      success: true,
      backendStatus: 'connected',
      backendData: healthData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('テストAPIエラー:', error);
    return NextResponse.json(
      { 
        error: 'Backend connection test failed',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
