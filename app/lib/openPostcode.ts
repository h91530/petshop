// 다음(카카오) 우편번호 검색 위젯 — 키 불필요, 무료
const SCRIPT_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

interface PostcodeResult {
  zonecode: string; // 우편번호
  address: string; // 도로명/지번 주소
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DaumWindow = Window & { daum?: any };

export function openPostcode(onComplete: (result: PostcodeResult) => void) {
  const w = window as DaumWindow;

  const open = () => {
    new w.daum.Postcode({
      oncomplete: (data: PostcodeResult) => {
        onComplete({ zonecode: data.zonecode, address: data.address });
      },
    }).open();
  };

  if (w.daum?.Postcode) {
    open();
    return;
  }

  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.onload = open;
  document.body.appendChild(script);
}
