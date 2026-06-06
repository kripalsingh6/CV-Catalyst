export const Alert = ({message,type="error"})=>{

    if(!message){
        return null;
    };
    const styles = {
        error:{bg: "#fff0f0", border: "#fca5a5", text: "#991b1b", icon: "⚠" },
        success:{bg: "#f0fdf4", border: "#86efac", text: "#166534", icon: "✓"}
    }
    const s = styles[type] || styles.error;

    return(
        <div style={{
            padding:"10px 14px", borderRadius:"8px" , fontSize:"13px",
            marginBottom:"1rem" , display:"flex", alignItems:"flex-start",
            background:s.bg , border:`1px solid ${s.border}` , color:s.text,
            lineHeight:1.5
        }}>
            <span style={{flexShrink: 0 , marginTop:"1px"}}>{s.icon}</span>
            <span>{message}</span>

        </div>
    )

}