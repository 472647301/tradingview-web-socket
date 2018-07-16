<template>
  <div class="doc_head">
    <h1 class="head_logo">
      <a href="/"><img src="../../assets/logo.d39f9c0.svg" alt="火币专业交易站"></a>
    </h1>
    <ul class="head_nav" id="head_nav">
      <li>
        <router-link to="/trader">法币交易</router-link>
      </li>
      <li class="cur">
        <router-link to="/trader" class="page_otc_link">币币交易</router-link>
      </li>
      <li class="">
        <router-link to="/trader">杠杆交易</router-link>
      </li>
      <li class="head-user hgt-slide ">
        <router-link to="/">HADAX</router-link>
      </li>
      <li class="head-padding"></li>
      <li class="login_hide">
        <a href="javascript:;">登录</a>
      </li>
      <li class="split"></li>
      <li class="login_hide">
        <a href="javascript:;">注册</a>
      </li>
      <li class="split"></li>
      <li class="mobile_show_item lang_btn">
        <dl class="select_lang">
          <dt>简体中文</dt>
          <dd>
            <a href="javascript:void(0);" data-lang="en-us">English</a>
            <a href="javascript:void(0);" data-lang="zh-cn">简体中文</a>
            <a href="javascript:void(0);" data-lang="zh-hk">繁體中文</a>
            <a href="javascript:void(0);" data-lang="ko-kr">한국어</a>
            <a href="javascript:void(0);" data-lang="ru-ru">Русский</a>
            <a href="javascript:void(0);" data-lang="de-de">Deutsch</a>
            <a href="javascript:void(0);" data-lang="fr-fr">Français</a>
            <a href="javascript:void(0);" data-lang="es-es">Español</a>
            <a href="javascript:void(0);" data-lang="th-th">ไทย</a>
            <a href="javascript:void(0);" data-lang="vi-vi">Tiếng Việt</a>
            <a href="javascript:void(0);" data-lang="tr-tr">Türkiye</a>
            <a href="javascript:void(0);" data-lang="pt-pt">Português</a>
          </dd>
        </dl>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.doc_head {
  width: 100%;
  height: 60px;
  position: relative;
  z-index: 5;
  background-color: #181b2a;
  color: #c7cce6;
  font-size: 14px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

.doc_head .head_logo {
  padding-left: 30px;
  height: 60px;
}

.doc_head .head_nav {
  -ms-flex: 1;
  flex: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-right: 30px;
}

.hb-night a {
  text-decoration: none;
  color: #7a98f7;
  transition: all .2s ease-in-out;
  cursor: pointer;
}

.doc_head .head_logo img {
  display: block;
  padding-top: 18px;
  border: 0;
}

.doc_head .head_nav>li {
  position: relative;
  margin-left: 30px;
  height: 56px;
  z-index: 2;
  line-height: 56px;
  white-space: nowrap;
}

.doc_head .head_nav>li.head-padding {
  -ms-flex: 1;
  flex: 1;
}

.doc_head .head_nav>li.split {
  color: #1f2943;
  content: "";
  height: 56px;
  line-height: 56px;
  margin: 0 10px;
}

.doc_head .head_nav>li.split+li {
  margin-left: 0;
}

.doc_head .select_lang {
  font-size: 12px;
  position: relative;
  z-index: 8;
  cursor: pointer;
  color: #c7cce6;
}

.doc_head .select_lang dt {
  height: 20px;
  border: 1px solid;
  border-radius: 20px;
  line-height: 20px;
  padding: 0 12px;
  display: inline-block;
}

.doc_head .select_lang dd {
  display: none;
  position: absolute;
  top: 56px;
  width: 220px;
  right: 0;
  background: #262a42;
  box-shadow: 0 8px 16px rgba(0, 0, 0, .4);
  border-radius: 3px;
}

.doc_head .select_lang dd a {
  float: left;
  color: #c7cce6;
  width: 50%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-family: PingFang SC, Helvetica, Noto Sans KR, serif;
}

.doc_head .head_nav>li a {
  color: #c7cce6;
  text-decoration: none;
}

.hb-night a {
  text-decoration: none;
  color: #7a98f7;
  transition: all .2s ease-in-out;
  cursor: pointer;
}

.doc_head .head_nav>li a:hover {
  color: #7a98f7;
  text-decoration: none;
}

.doc_head .select_lang dt:after {
  margin-top: -5px;
  margin-left: 8px;
  content: "";
  color: #c7cce6;
  display: inline-block;
  width: 6px;
  height: 6px;
  vertical-align: middle;
  transform: rotate(-45deg);
  border-bottom: 1px solid currentColor;
  border-left: 1px solid currentColor;
}

.doc_head .select_lang:hover,
.doc_head .select_lang:hover dt:after {
  color: #7a98f7;
}

.doc_head .select_lang:hover dd {
  display: block;
}
</style>

