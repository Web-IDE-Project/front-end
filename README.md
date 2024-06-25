![header](https://capsule-render.vercel.app/api?type=waving&height=250&color=48BB78&text=3Ever%20-%20Web%20IDE&textBg=false&fontColor=ffffff&fontSize=40&fontAlign=50&fontAlignY=39&section=header)

<div align="center">
  <h4>개발 기간: 2024-05-30 ~ 2024-06-24</h3><br>
  <a href="#배포-주소">배포 주소</a> • <a href="#프로젝트-소개">프로젝트 소개</a> • <a href="#front-end-멤버-소개">Front-end 멤버 소개</a> • <a href="#역할-및-담당-기능">역할 및 담당 기능</a> • <a href="#주요-기능">주요 기능</a> • <a href="#아키텍처">아키텍처</a> • <a href="#시연영상">시연영상</a>
</div>

<br><br>


### 배포 주소
> 🔗 [3Ever](http://ec2-52-79-123-145.ap-northeast-2.compute.amazonaws.com/)

<br><br>

### 프로젝트 소개
3Ever는 누구든, 언제든, 어디서든 강의자가 문제를 해결하는 과정을 실시간으로 보여주고, 수강생의 코딩하는 사고도 기를 수 있도록 도와주는 라이브코딩 웹 IDE 서비스입니다.

<br><br>

### Front-end 멤버 소개
|<img width="200" src="https://avatars.githubusercontent.com/u/63189595?v=4" alt="프로필 이미지">|<img width="200" src="https://avatars.githubusercontent.com/u/96777845?v=4" alt="프로필 이미지">|
|:---:|:---:|
|[**채유빈**](https://github.com/ChaeYubin)|[**박경민**](https://github.com/gangmin2)|

<br><br>

### 역할 및 담당 기능
<table>
  <tr>
    <th>이름</th>
    <td>채유빈</td>
    <td>박경민</td>
  </tr>
  
  <tr>
    <th>역할</th>
    <td>팀장, 프로젝트 PM</td>
    <td>팀원</td>
  </tr>
  
  <tr>
    <th>기능</th>
    <td>
      <ul>
        <li>와이어 프레임 제작 및 디자인</li>
        <li>프론트엔드 CI/CD 구측</li>
        <li>컨테이너 페이지(컨테이너 CRUD 기능)</li>
        <li>코드 편집기 페이지(파일/디렉토리 CRUD, 파일트리/코드 실시간 동시 편집, 터미널 기능)</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>랜딩 페이지</li>
        <li>회원가입/로그인 페이지</li>
        <li>회원 정보 수정 기능</li>
        <li>실시간 채팅/음성 채팅 기능</li>
      </ul>
    </td>
  </tr>
</table>

<br><br>

### 주요 기능
|🔓 소셜 로그인|🏗️ 컨테이너 공유|🧑‍💻 실시간 동시 편집|💬 실시간 채팅|
|---|---|---|---|
|안전하게 사용자의 인증 및 권한 부여를 처리함으로써 보안을 강화하고 다양한 클라이언트를 지원하는 환경 제공|언제, 어디서나 개인 컨테이너의 코드 그대로 질문/강의 컨테이너로 공유가능 환경 제공|CRDT 기반 분산 편집을 활용하여 네트워크 상태에 상관 없이 안정적인 실시간 동기화 및 편집 환경 제공|실시간 채팅을 활용하여 원활한 소통 가능 환경 제공|
<br>

#### 소셜 로그인
일반 회원가입, 로그인 기능 제공과 동시에 소셜 로그인 기능을 제공하여 사용자는 별도의 회원가입과 로그인 과정을 거치지 않고도 카카오, 네이버, 구글 계정을 통해 서비스를 이용할 수 있습니다.
Spring Security, OAuth2를 이용하였으며 인증된 사용자의 상태는 세션을 통해 유지하고, 세션 유효성 검사를 통해 자동 로그인 기능을 구현하였습니다.

<br>

#### 컨테이너 생성, 실행
사용자는 컨테이너의 이름, 설명을 입력하고 언어를 선택하여 컨테이너를 생성하고 실행할 수 있습니다. 컨테이너 실행 시에는 생성 시 선택했던 언어의 기본 템플릿을 제공합니다.

<br>

#### 파일 및 폴더 생성
사용자는 파일 및 폴더를 생성할 수 있습니다. 계층 구조를 구현하여 폴더 내에는 여러 개의 파일 및 폴더를 생성할 수 있습니다.

<br>

#### 컴파일 및 실행
선택한 언어를 통해 도커 컨테이너 이미지를 생성하여 다양한 언어를 컴파일 하고 실행할 수 있습니다. (Java, Javascript, Python, C, CPP 지원)

<br>

#### 터미널
사용자는 컨테이너 내에서 터미널 기능을 이용할 수 있습니다. 웹소켓 서버를 이용하여 실시간으로 입력한 터미널 명령의 결과를 얻을 수 있습니다.

<br>

#### 컨테이너 공유 및 상태 수정
사용자는 컨테이너를 강의 또는 질문 컨테이너로 공유할 수 있고, 공유된 컨테이너에는 다른 사용자들이 참여할 수 있습니다.
공유 상태인 컨테이너를 완료 또는 해결 상태로 수정하면 모든 사용자는 해당 컨테이너의 내용을 확인할 수 있습니다.

<br>

#### 실시간 동시 편집
강의 컨테이너에 접속한 사용자들은 강의자의 코드 편집을 실시간으로 확인할 수 있습니다. 질문 컨테이너에 접속한 사용자들은 코드 편집을 실시간으로 확인은 물론, 동시 편집이 가능합니다.  

<br>

#### 채팅
공유된 컨테이너에 참여한 사용자들은 실시간 채팅을 이용할 수 있습니다. 웹소켓 서버를 이용하여 실시간으로 채팅을 주고 받을 수 있습니다. 

<br><br>

### 아키텍처
<img alt="프로젝트 아키텍처" src="https://github.com/Web-IDE-Project/front-end/assets/96777845/a70ef026-e891-4afc-831a-568b53dbbcab">

<br><br>

### 시연영상
[보러가기](https://www.youtube.com/watch?v=gfLYe-VhBAg)

<br><br>

![footer](https://capsule-render.vercel.app/api?type=waving&height=150&color=48BB78&section=footer)
