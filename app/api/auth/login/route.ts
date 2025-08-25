import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== プロキシPOSTリクエスト受信開始 ===');
    console.log('リクエストURL:', request.url);
    console.log('リクエストメソッド:', request.method);
    console.log('リクエストヘッダー:', Object.fromEntries(request.headers.entries()));
    
    const formData = await request.formData();
    
    console.log('プロキシ経由でログインリクエスト詳細:', {
      username: formData.get('username'),
      hasPassword: !!formData.get('password'),
      passwordLength: formData.get('password')?.toString().length || 0,
      formDataEntries: Array.from(formData.entries()),
      formDataKeys: Array.from(formData.keys()),
      formDataValues: Array.from(formData.values())
    });

    // バックエンドにリクエストを転送
    console.log('バックエンドへのリクエスト送信...');
    console.log('バックエンドURL:', 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1/auth/token');
    
    try {
      console.log('バックエンドへのリクエスト詳細:', {
        url: 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1/auth/token',
        method: 'POST',
        bodyType: 'FormData',
        formDataContent: {
          username: formData.get('username'),
          hasPassword: !!formData.get('password'),
          passwordLength: formData.get('password')?.toString().length || 0
        }
      });
      
      const backendResponse = await fetch(
        'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1/auth/token',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      console.log('バックエンドレスポンス受信:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        ok: backendResponse.ok,
        headers: Object.fromEntries(backendResponse.headers.entries())
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error('バックエンドエラー詳細:', {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          body: errorText,
          headers: Object.fromEntries(backendResponse.headers.entries())
        });
        
        // エラーの詳細を解析
        let errorDetails = errorText;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.detail) {
            errorDetails = errorData.detail;
          } else if (errorData.message) {
            errorDetails = errorData.message;
          }
        } catch (parseError) {
          console.log('エラーデータのJSON解析に失敗:', parseError);
        }
        
        // バックエンドからの詳細なエラー情報を返す
        return NextResponse.json(
          { 
            error: `Backend error: ${backendResponse.status} ${backendResponse.statusText}`,
            details: errorDetails,
            backendStatus: backendResponse.status,
            rawResponse: errorText
          },
          { status: backendResponse.status }
        );
      }

      const data = await backendResponse.json();
      console.log('バックエンドレスポンス成功:', data);

      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('バックエンドへのリクエストでエラー:', fetchError);
      
      return NextResponse.json(
        { 
          error: 'Backend request failed',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          backendStatus: 0
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('プロキシエラー:', error);
    return NextResponse.json(
      { 
        error: 'Proxy error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
