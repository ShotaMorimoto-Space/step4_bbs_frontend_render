import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
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
    const { video_url, club_type, swing_form, swing_note, user_id } = body;

    if (!video_url || !user_id) {
      return NextResponse.json(
        { error: 'video_url and user_id are required' },
        { status: 400 }
      );
    }

    // バックエンドAPIのベースURL
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
    
    // まず、動画のvideo_idを取得
    const searchResponse = await fetch(`${apiUrl}/videos/search?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      console.error('動画検索失敗:', searchResponse.status);
      return NextResponse.json(
        { error: 'Failed to search videos' },
        { status: searchResponse.status }
      );
    }

    const searchResult = await searchResponse.json();
    const targetVideo = searchResult.videos.find((v: any) => v.video_url === video_url);
    
    if (!targetVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // 動画のメタデータを更新
    const updateResponse = await fetch(`${apiUrl}/video/${targetVideo.video_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        club_type,
        swing_form,
        swing_note
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      console.error('動画更新失敗:', updateResponse.status, errorData);
      return NextResponse.json(
        { error: 'Failed to update video' },
        { status: updateResponse.status }
      );
    }

    const updateResult = await updateResponse.json();
    
    // レスポンスをそのまま返す
    return NextResponse.json(updateResult);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
