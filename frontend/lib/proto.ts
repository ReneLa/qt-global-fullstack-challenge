import protobuf from "protobufjs";

let rootPromise: Promise<protobuf.Root> | null = null;

export function loadProto() {
  if (!rootPromise) {
    rootPromise = protobuf.load("/proto/user.proto");
  }

  return rootPromise;
}

export async function decodeUserList(buffer: ArrayBuffer) {
  const root = await loadProto();
  const UserList = root.lookupType("UserList");

  const decoded = UserList.decode(new Uint8Array(buffer));

  return UserList.toObject(decoded, { enums: String });
}
