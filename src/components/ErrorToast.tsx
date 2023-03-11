export default function errorToast(props: any) {
  return (
    <div>
      <div class="alert alert-error">
        <div>
          <span>{props.errorMsg}</span>
        </div>
      </div>
    </div>
  )
}
