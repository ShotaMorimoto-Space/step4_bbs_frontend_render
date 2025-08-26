'use client';

import React from 'react';

type User = {
  id: string;
  name: string;
  avatar: string;  // 画像のパス
  video?: string;  // 動画のパス（任意）
};

type Props = {
  users: User[];
  onClickUser?: (userId: string) => void;
};

export default function UserList({ users, onClickUser }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white/80 rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
          onClick={() => onClickUser?.(user.id)}
        >
          {user.video ? (
            <video
              src={user.video}
              poster={user.avatar}
              muted
              playsInline
              loop
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          ) : (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          )}
          <p className="text-center font-medium">{user.name}</p>
        </div>
      ))}
    </div>
  );
}
