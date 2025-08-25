import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    // Authorizationヘッダーを取得
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const { videoId } = params;

    if (!videoId) {
      return NextResponse.json(
        { error: 'video_id is required' },
        { status: 400 }
      );
    }

    // バックエンドAPIのベースURL
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aps-bbc-02-dhdqd5eqgxa7f0hg.canadacentral-01.azurewebsites.net/api/v1';
    
    // バックエンドの/video/{video_id}/feedback-summaryエンドポイントにリクエストを転送
    const response = await fetch(`${apiUrl}/video/${videoId}/feedback-summary`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to fetch video feedback from backend' },
        { status: response.status }
      );
    }

    const feedbackData = await response.json();
    
    // レスポンスをそのまま返す
    return NextResponse.json(feedbackData);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
