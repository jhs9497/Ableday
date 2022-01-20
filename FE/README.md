## 아이콘

![아이콘_여](%EC%95%84%EC%9D%B4%EC%BD%98_%EC%97%AC.png)

![아이콘_남](%EC%95%84%EC%9D%B4%EC%BD%98_%EB%82%A8.png)

## 테마색

![컬러테마](%EC%BB%AC%EB%9F%AC%ED%85%8C%EB%A7%88.PNG)



## 공통 버튼 CSS

![image-20210914022929894](image-20210914022929894.png)



## 커스터마이징 하고 싶으면

```react
import React from 'react';
import 'src/common/commonCss/common.css';
import 'src/common/commonCss/videoChat.css';

<div>
    <button className="videoChat-btn-sm btn-sm">btn-sm</button>  // 커스터마이징한 css가 앞에 가도록
</div>
```

