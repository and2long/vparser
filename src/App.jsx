import axios from "axios";
import { useState } from "react";
import { Loader } from "./Loader";

export const App = () => {

  const [value, setValue] = useState("")
  const [obj, setObj] = useState({})
  const [err, setErr] = useState("")
  const [fn, setFn] = useState("")
  const [fvkey, setFvKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [uiList, setUiList] = useState([])

  async function onSubmit(e) {
    e.preventDefault()
    if (value.indexOf("v.qq.com/x/page") !== -1) {
      // 截取vid
      try {
        const vid = value.substring(value.lastIndexOf("/") + 1, value.length - 5)
        setLoading(true)
        setErr("")
        setUiList([])
        const response = await axios({
          method: 'get',
          url: `/getinfo?vids=${vid}&platform=101001&charge=0&otype=json`,
          withCredentials: false,
        })
        console.log(response.data);
        setLoading(false)
        const data = response.data.substring(13, response.data.length - 1)
        let obj = JSON.parse(data)
        console.log(obj)
        setObj(obj)
        // url+fn+?vkey=+fvkey
        const uiList = obj.vl.vi[0].ul.ui
        const fvkey = obj.vl.vi[0].fvkey
        const fn = obj.vl.vi[0].fn
        setUiList(uiList)
        setFn(fn)
        setFvKey(fvkey)
      } catch (error) {
        console.log(error)
        setErr(error.toString())
        setLoading(false)
      }
    } else {
      alert('视频地址格式错误。')
    }

  }

  return (
    <div>
      <h1>视频助手</h1>
      <p style={{ fontSize: 14, color: "#333" }}>暂时支持腾讯视频，如：https://v.qq.com/x/page/r0749ofn0t5.html</p>
      <form onSubmit={onSubmit}>
        <input type={"text"} value={value} style={{ width: 300, marginRight: 10 }} onChange={(e) => setValue(e.target.value)}></input>
        <button type="submit">解析视频</button>
      </form>
      {loading && <Loader />}
      {
        !loading && uiList.length > 0 &&
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div >👇解析结果，点击预览并保存👇</div>
          <div>
            {uiList.map((item, index) => <li key={index} style={{ display: "block", float: "left", marginRight: "20px" }}><a href={`${item.url}${fn}?vkey=${fvkey}`} target="_blank" rel="noreferrer">{`真实地址${index + 1}`}</a></li>)}
          </div>
        </div>
      }
      {!loading && err && <pre><div>{JSON.stringify(obj, null, 2)}</div></pre>}
      {!loading && err && <div>{err}</div>}
    </div>
  )
}
