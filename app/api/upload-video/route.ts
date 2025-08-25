import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Authorizationヘッダーを取得
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // リクエストボディを取得
    const body = await request.json();
    const { video_url, thumbnail_url, club_type, swing_form, swing_note, user_id } = body;

    if (!video_url || !user_id) {
      return NextResponse.json(
        { error: 'video_url and user_id are required' },
        { status: 400 }
      );
    }

    // バックエンドAPIのベースURL
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
    
    // バックエンドの/upload-videoエンドポイントにリクエストを転送
    const response = await fetch(`${apiUrl}/upload-video`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_url,
        thumbnail_url,
        club_type,
        swing_form,
        swing_note,
        user_id
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to upload video to backend' },
        { status: response.status }
      );
    }

    const uploadResult = await response.json();
    
    // レスポンスをそのまま返す
    return NextResponse.json(uploadResult);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
