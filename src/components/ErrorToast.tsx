export default function errorToast(props: any) {
  return (
    <div>
      <div class="alert bg-primary text-primary-content">
        <div class="font-h3">
          <span>{props.errorMsg}</span>
        </div>
      </div>
    </div>
  )
}
