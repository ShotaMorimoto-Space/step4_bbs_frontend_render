import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Authorizationヘッダーを取得
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // URLからuser_idを取得
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }
    
    // UUIDの形式を検証
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user_id)) {
      console.error('無効なuser_id形式:', user_id);
      return NextResponse.json(
        { 
          error: 'Invalid user_id format. Must be a valid UUID.',
          received_user_id: user_id,
          expected_format: 'UUID v4 format'
        },
        { status: 422 }
      );
    }

    // バックエンドAPIのベースURL
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
    
    // バックエンドの/user/{user_id}/videos/summaryエンドポイントにリクエストを転送
    const response = await fetch(`${apiUrl}/user/${user_id}/videos/summary`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend API error:', response.status, errorData);
      
      // 422エラーの場合は詳細なエラー情報を返す
      if (response.status === 422) {
        try {
          const errorJson = JSON.parse(errorData);
          return NextResponse.json(
            { 
              error: 'Validation error from backend',
              details: errorJson,
              status: response.status 
            },
            { status: 422 }
          );
        } catch (parseError) {
          return NextResponse.json(
            { 
              error: 'Validation error from backend',
              rawError: errorData,
              status: response.status 
            },
            { status: 422 }
          );
        }
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch user videos from backend',
          status: response.status,
          details: errorData
        },
        { status: response.status }
      );
    }

    const videosData = await response.json();
    
    // レスポンスをそのまま返す
    return NextResponse.json(videosData);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
